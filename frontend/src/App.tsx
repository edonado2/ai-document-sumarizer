import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

function App() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [processingStats, setProcessingStats] = useState<{
    originalWords: number;
    summaryWords: number;
    reduction: number;
    processingTime: number;
  } | null>(null);
  const [aiProvider, setAiProvider] = useState<string>('');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setUploadedFile(file);
    setIsProcessing(true);
    setError('');

    try {
      // Step 1: Upload file and extract text
      const formData = new FormData();
      formData.append('document', file);

      const uploadResponse = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.message || 'Failed to upload file');
      }

      const uploadData = await uploadResponse.json();
      const extracted = uploadData.data;
      setExtractedText(extracted.text);
      
      // Step 2: Generate AI summary
      const summarizeResponse = await fetch('http://localhost:5000/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: extracted.text,
          fileName: extracted.fileName,
        }),
      });

      if (!summarizeResponse.ok) {
        const errorData = await summarizeResponse.json();
        throw new Error(errorData.message || 'Failed to generate summary');
      }

      const summarizeData = await summarizeResponse.json();
      const summaryResult = summarizeData.data;
      setSummary(summaryResult.summary);
      
      // Store processing statistics
      setProcessingStats({
        originalWords: summaryResult.wordCount.original,
        summaryWords: summaryResult.wordCount.summary,
        reduction: summaryResult.wordCount.reduction,
        processingTime: summaryResult.processingTime
      });

      // Get AI provider info
      try {
        const healthResponse = await fetch('http://localhost:5000/api/summarize/health');
        if (healthResponse.ok) {
          const healthData = await healthResponse.json();
          setAiProvider(healthData.model || 'AI Provider');
        }
      } catch (err) {
        console.log('Could not fetch provider info');
      }
      
    } catch (err) {
      console.error('Processing error:', err);
      setError(err instanceof Error ? err.message : 'Failed to process the document. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: isProcessing
  });

  const resetApp = () => {
    setUploadedFile(null);
    setExtractedText('');
    setSummary('');
    setError('');
    setProcessingStats(null);
    setAiProvider('');
    setIsProcessing(false);
  };
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f9fafb',
      fontFamily: 'Inter, system-ui, sans-serif',
      padding: '2rem'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          color: '#111827',
          marginBottom: '1rem'
        }}>
          🧠 AI Document Summarizer
        </h1>
        <p style={{
          fontSize: '1.25rem',
          color: '#6b7280',
          marginBottom: '3rem'
        }}>
          Transform lengthy documents into concise insights
        </p>
        
        <div style={{
          backgroundColor: 'white',
          padding: '3rem',
          borderRadius: '1rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          marginBottom: '2rem'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '1rem'
          }}>
            Upload Your Document
          </h2>
          <p style={{
            color: '#6b7280',
            marginBottom: '2rem',
            fontSize: '1.1rem'
          }}>
            Upload a PDF, Word document, or text file to get an AI-powered summary with key insights.
          </p>
          
          <div 
            {...getRootProps()} 
            style={{
              border: isDragActive ? '2px dashed #3b82f6' : '2px dashed #d1d5db',
              borderRadius: '0.75rem',
              padding: '3rem',
              backgroundColor: isDragActive ? '#eff6ff' : '#f9fafb',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              marginBottom: '2rem',
              opacity: isProcessing ? 0.6 : 1
            }}
          >
            <input {...getInputProps()} />
            {isProcessing ? (
              <>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
                <p style={{
                  fontSize: '1.125rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Processing your document...
                </p>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#6b7280'
                }}>
                  Please wait while we extract text and generate a summary
                </p>
              </>
            ) : (
              <>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📄</div>
                <p style={{
                  fontSize: '1.125rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  {isDragActive ? 'Drop your file here' : 'Drag and drop a file here, or click to select'}
                </p>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#6b7280'
                }}>
                  Supported formats: PDF, DOCX, TXT (max 10MB)
                </p>
              </>
            )}
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            marginTop: '2rem'
          }}>
            <div style={{
              padding: '1.5rem',
              backgroundColor: '#eff6ff',
              borderRadius: '0.5rem',
              border: '1px solid #dbeafe'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🤖</div>
              <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>AI-Powered Analysis</h3>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                Advanced GPT-4 technology provides accurate summaries
              </p>
            </div>
            
            <div style={{
              padding: '1.5rem',
              backgroundColor: '#f0fdf4',
              borderRadius: '0.5rem',
              border: '1px solid #bbf7d0'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💡</div>
              <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Key Insights</h3>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                Get 3-5 actionable insights for quick decision-making
              </p>
            </div>
            
            <div style={{
              padding: '1.5rem',
              backgroundColor: '#fef3c7',
              borderRadius: '0.5rem',
              border: '1px solid #fde68a'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📁</div>
              <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Multiple Formats</h3>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                Support for PDF, Word documents, and text files
              </p>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {(uploadedFile || extractedText || summary || error) && (
          <div style={{
            backgroundColor: 'white',
            padding: '3rem',
            borderRadius: '1rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb',
            marginBottom: '2rem'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '2rem'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#111827',
                margin: 0
              }}>
                Document Analysis Results
              </h2>
              <button
                onClick={resetApp}
                style={{
                  backgroundColor: '#6b7280',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                Process Another Document
              </button>
            </div>

            {error && (
              <div style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '0.5rem',
                padding: '1rem',
                marginBottom: '2rem'
              }}>
                <p style={{ color: '#dc2626', margin: 0 }}>❌ {error}</p>
              </div>
            )}

            {uploadedFile && (
              <div style={{
                backgroundColor: '#f0f9ff',
                border: '1px solid #bae6fd',
                borderRadius: '0.5rem',
                padding: '1rem',
                marginBottom: '2rem'
              }}>
                <p style={{ color: '#0369a1', margin: 0 }}>
                  📁 <strong>File:</strong> {uploadedFile.name} ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              </div>
            )}

            {extractedText && (
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '1rem'
                }}>
                  📄 Extracted Text
                </h3>
                <div style={{
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  padding: '1rem',
                  maxHeight: '200px',
                  overflowY: 'auto'
                }}>
                  <p style={{ 
                    color: '#374151', 
                    margin: 0, 
                    lineHeight: '1.6',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {extractedText}
                  </p>
                </div>
              </div>
            )}

            {summary && (
      <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1rem'
                }}>
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    color: '#111827',
                    margin: 0
                  }}>
                    🤖 AI Summary
                  </h3>
                  {aiProvider && (
                    <span style={{
                      backgroundColor: '#dbeafe',
                      color: '#1e40af',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '1rem',
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}>
                      Powered by {aiProvider}
                    </span>
                  )}
                </div>
                <div style={{
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: '0.5rem',
                  padding: '1.5rem'
                }}>
                  <p style={{ 
                    color: '#166534', 
                    margin: 0, 
                    lineHeight: '1.6',
                    fontSize: '1.1rem'
                  }}>
                    {summary}
                  </p>
                </div>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem',
                  marginTop: '2rem'
                }}>
                  <div style={{
                    backgroundColor: '#eff6ff',
                    border: '1px solid #dbeafe',
                    borderRadius: '0.5rem',
                    padding: '1rem',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📊</div>
                    <p style={{ margin: 0, fontWeight: '600' }}>Original Words</p>
                    <p style={{ margin: 0, color: '#6b7280' }}>
                      {processingStats ? processingStats.originalWords.toLocaleString() : '0'} words
                    </p>
                  </div>
                  
                  <div style={{
                    backgroundColor: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    borderRadius: '0.5rem',
                    padding: '1rem',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⚡</div>
                    <p style={{ margin: 0, fontWeight: '600' }}>Processing Time</p>
                    <p style={{ margin: 0, color: '#6b7280' }}>
                      {processingStats ? `${(processingStats.processingTime / 1000).toFixed(1)}s` : '0s'}
                    </p>
                  </div>
                  
                  <div style={{
                    backgroundColor: '#fef3c7',
                    border: '1px solid #fde68a',
                    borderRadius: '0.5rem',
                    padding: '1rem',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📈</div>
                    <p style={{ margin: 0, fontWeight: '600' }}>Compression</p>
                    <p style={{ margin: 0, color: '#6b7280' }}>
                      {processingStats ? `${processingStats.reduction}% reduction` : '0%'}
                    </p>
                  </div>
                </div>
              </div>
            )}
      </div>
        )}
        
        <div style={{
          color: '#6b7280',
          fontSize: '0.875rem'
        }}>
          <p>🚀 Ready to process your documents with AI!</p>
          <p style={{ marginTop: '0.5rem' }}>
            Built with React, TypeScript, and OpenAI GPT-4
          </p>
          <div style={{
            backgroundColor: '#fef3c7',
            border: '1px solid #fde68a',
            borderRadius: '0.5rem',
            padding: '1rem',
            marginTop: '1rem',
            textAlign: 'left'
          }}>
            <p style={{ margin: 0, fontWeight: '600', color: '#92400e' }}>
              ⚠️ Setup Required:
            </p>
            <p style={{ margin: '0.5rem 0 0 0', color: '#92400e', fontSize: '0.8rem' }}>
              To use real AI analysis, add an API key to <code>backend/.env</code>:
              <br />
              <strong>Free Option:</strong> <code>GEMINI_API_KEY=your_gemini_key</code>
              <br />
              <strong>Premium:</strong> <code>OPENAI_API_KEY=your_openai_key</code>
              <br />
              <em>Get Gemini API key free at: <a href="https://makersuite.google.com/app/apikey" target="_blank" style={{color: '#1e40af'}}>Google AI Studio</a></em>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;