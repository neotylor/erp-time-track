import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Upload, 
  Download, 
  Copy, 
  Trash2, 
  FileText, 
  AlertCircle,
  Check
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProcessingState {
  isProcessing: boolean;
  progress: number;
  processedBytes: number;
  totalBytes: number;
  throughput: number;
}

const Base64Tool: React.FC = () => {
  const { toast } = useToast();
  const [encodeInput, setEncodeInput] = useState('');
  const [decodeInput, setDecodeInput] = useState('');
  const [encodeOutput, setEncodeOutput] = useState('');
  const [decodeOutput, setDecodeOutput] = useState('');
  const [urlSafe, setUrlSafe] = useState(false);
  const [lineWrap, setLineWrap] = useState(true);
  const [processingState, setProcessingState] = useState<ProcessingState>({
    isProcessing: false,
    progress: 0,
    processedBytes: 0,
    totalBytes: 0,
    throughput: 0
  });
  const [error, setError] = useState('');
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [isLargeFile, setIsLargeFile] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const workerRef = useRef<Worker | null>(null);
  const startTimeRef = useRef<number>(0);

  // Initialize worker
  React.useEffect(() => {
    workerRef.current = new Worker('/base64-worker.js');
    
    workerRef.current.onmessage = (e) => {
      const { type, result, progress, processedBytes, totalBytes, error } = e.data;
      
      if (type === 'progress') {
        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        const throughput = processedBytes / elapsed / (1024 * 1024); // MB/s
        
        setProcessingState(prev => ({
          ...prev,
          progress,
          processedBytes,
          totalBytes,
          throughput
        }));
      } else if (type === 'complete') {
        setProcessingState(prev => ({ ...prev, isProcessing: false }));
        
        if (typeof result === 'string') {
          // Encoding result
          setEncodeOutput(result);
        } else {
          // Decoding result
          const blob = new Blob([result]);
          const url = URL.createObjectURL(blob);
          setDecodeOutput(`[Binary file ready for download - ${formatBytes(blob.size)}]`);
          
          // Auto-download for binary files
          const link = document.createElement('a');
          link.href = url;
          link.download = currentFile?.name.replace(/\.[^/.]+$/, '_decoded') || 'decoded_file';
          link.click();
          URL.revokeObjectURL(url);
        }
      } else if (type === 'error') {
        setError(error);
        setProcessingState(prev => ({ ...prev, isProcessing: false }));
      }
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, [currentFile]);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getPreviewText = (text: string, isLarge: boolean) => {
    if (!isLarge || text.length <= 128 * 1024) return text;
    
    const start = text.slice(0, 32 * 1024);
    const end = text.slice(-32 * 1024);
    return start + '\n\n... [Content truncated for display. Full content will be processed.] ...\n\n' + end;
  };

  const handleFileUpload = useCallback((file: File) => {
    setCurrentFile(file);
    setError('');
    
    const isLarge = file.size > 1024 * 1024; // 1MB threshold
    setIsLargeFile(isLarge);
    
    if (file.type.startsWith('text/') || file.name.endsWith('.txt')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setEncodeInput(getPreviewText(text, isLarge));
      };
      reader.readAsText(file);
    } else {
      setEncodeInput(`[Binary file: ${file.name} (${formatBytes(file.size)})]`);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  }, [handleFileUpload]);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const processEncode = async () => {
    if (!encodeInput.trim() && !currentFile) return;
    
    setError('');
    setProcessingState({
      isProcessing: true,
      progress: 0,
      processedBytes: 0,
      totalBytes: 0,
      throughput: 0
    });
    
    startTimeRef.current = Date.now();
    
    try {
      let buffer: ArrayBuffer;
      
      if (currentFile) {
        buffer = await currentFile.arrayBuffer();
      } else {
        const encoder = new TextEncoder();
        buffer = encoder.encode(encodeInput).buffer;
      }
      
      workerRef.current?.postMessage({
        type: 'encode',
        data: { buffer, urlSafe, lineWrap }
      });
    } catch (err) {
      setError('Failed to process file: ' + (err as Error).message);
      setProcessingState(prev => ({ ...prev, isProcessing: false }));
    }
  };

  const processDecode = async () => {
    if (!decodeInput.trim()) return;
    
    setError('');
    setProcessingState({
      isProcessing: true,
      progress: 0,
      processedBytes: 0,
      totalBytes: 0,
      throughput: 0
    });
    
    startTimeRef.current = Date.now();
    
    workerRef.current?.postMessage({
      type: 'decode',
      data: { text: decodeInput, urlSafe }
    });
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard",
        description: "Text has been copied successfully",
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const downloadText = (text: string, filename: string) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setEncodeInput('');
    setDecodeInput('');
    setEncodeOutput('');
    setDecodeOutput('');
    setCurrentFile(null);
    setIsLargeFile(false);
    setError('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Encoder Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Encode to Base64
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* File Upload */}
          <div
            className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={handleFileSelect}
          >
            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Drop a file here or click to select
            </p>
            {currentFile && (
              <p className="text-xs text-primary mt-1">
                {currentFile.name} ({formatBytes(currentFile.size)})
              </p>
            )}
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
          />

          {/* Text Input */}
          <div>
            <Label htmlFor="encode-input">Text Input</Label>
            <Textarea
              id="encode-input"
              placeholder="Enter text to encode..."
              value={encodeInput}
              onChange={(e) => setEncodeInput(e.target.value)}
              className="min-h-[120px] font-mono text-sm"
            />
            {isLargeFile && (
              <p className="text-xs text-muted-foreground mt-1">
                Large file preview (showing first/last 64KB)
              </p>
            )}
          </div>

          {/* Options */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                id="url-safe"
                checked={urlSafe}
                onCheckedChange={setUrlSafe}
              />
              <Label htmlFor="url-safe">URL-safe encoding</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="line-wrap"
                checked={lineWrap}
                onCheckedChange={setLineWrap}
              />
              <Label htmlFor="line-wrap">Line wrapping (76 chars)</Label>
            </div>
          </div>

          {/* Action Button */}
          <Button 
            onClick={processEncode} 
            disabled={processingState.isProcessing || (!encodeInput.trim() && !currentFile)}
            className="w-full"
          >
            {processingState.isProcessing ? 'Encoding...' : 'Encode'}
          </Button>

          {/* Output */}
          <div>
            <Label htmlFor="encode-output">Base64 Output</Label>
            <Textarea
              id="encode-output"
              value={encodeOutput}
              readOnly
              className="min-h-[120px] font-mono text-sm"
              placeholder="Encoded result will appear here..."
            />
            <div className="flex gap-2 mt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(encodeOutput)}
                disabled={!encodeOutput}
              >
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => downloadText(encodeOutput, 'encoded.txt')}
                disabled={!encodeOutput}
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Decoder Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Decode from Base64
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Text Input */}
          <div>
            <Label htmlFor="decode-input">Base64 Input</Label>
            <Textarea
              id="decode-input"
              placeholder="Enter Base64 string to decode..."
              value={decodeInput}
              onChange={(e) => setDecodeInput(e.target.value)}
              className="min-h-[200px] font-mono text-sm"
            />
          </div>

          {/* Options */}
          <div className="flex items-center space-x-2">
            <Switch
              id="url-safe-decode"
              checked={urlSafe}
              onCheckedChange={setUrlSafe}
            />
            <Label htmlFor="url-safe-decode">URL-safe decoding</Label>
          </div>

          {/* Action Button */}
          <Button 
            onClick={processDecode} 
            disabled={processingState.isProcessing || !decodeInput.trim()}
            className="w-full"
          >
            {processingState.isProcessing ? 'Decoding...' : 'Decode'}
          </Button>

          {/* Output */}
          <div>
            <Label htmlFor="decode-output">Decoded Output</Label>
            <Textarea
              id="decode-output"
              value={decodeOutput}
              readOnly
              className="min-h-[120px] font-mono text-sm"
              placeholder="Decoded result will appear here..."
            />
            <div className="flex gap-2 mt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(decodeOutput)}
                disabled={!decodeOutput || decodeOutput.startsWith('[Binary')}
              >
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => downloadText(decodeOutput, 'decoded.txt')}
                disabled={!decodeOutput || decodeOutput.startsWith('[Binary')}
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress and Status */}
      {processingState.isProcessing && (
        <Card className="lg:col-span-2">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing...</span>
                <span>{processingState.progress.toFixed(1)}%</span>
              </div>
              <Progress value={processingState.progress} />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>
                  {formatBytes(processingState.processedBytes)} / {formatBytes(processingState.totalBytes)}
                </span>
                <span>
                  {processingState.throughput.toFixed(2)} MB/s
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Alert className="lg:col-span-2" variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Clear All Button */}
      <div className="lg:col-span-2 text-center">
        <Button 
          variant="outline" 
          onClick={clearAll}
          className="gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Clear All
        </Button>
      </div>
    </div>
  );
};

export default Base64Tool;