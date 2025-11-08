import React, { useState } from 'react';
import { Upload, FileText, Download, Settings, Droplet } from 'lucide-react';

function App() {
  const [file, setFile] = useState(null);
  const [logo, setLogo] = useState(null);
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [opacity, setOpacity] = useState(0.3);
  const [logoOpacity, setLogoOpacity] = useState(1.0);
  const [fontSize, setFontSize] = useState(50);
  const [rotation, setRotation] = useState(0);
  const [color, setColor] = useState('#808080');
  const [position, setPosition] = useState('diagonal-right-left');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please select a valid PDF file');
      setFile(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
      setError('');
    } else {
      setError('Please drop a valid PDF file');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleLogoChange = (e) => {
    const selectedLogo = e.target.files[0];
    if (selectedLogo && (selectedLogo.type === 'image/png' || selectedLogo.type === 'image/jpeg' || selectedLogo.type === 'image/jpg')) {
      setLogo(selectedLogo);
      setError('');
    } else {
      setError('Please select a valid image file (PNG or JPEG)');
      setLogo(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a PDF file');
      return;
    }

    setIsProcessing(true);
    setError('');

    const formData = new FormData();
    formData.append('pdf', file);
    if (logo) {
      formData.append('logo', logo);
      formData.append('logoOpacity', logoOpacity);
    }
    formData.append('watermarkText', watermarkText);
    formData.append('opacity', opacity);
    formData.append('fontSize', fontSize);
    formData.append('rotation', rotation);
    formData.append('color', color);
    formData.append('position', position);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3002';
      const response = await fetch(`${apiUrl}/api/watermark`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process PDF');
      }

      // Download the file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `watermarked-${file.name}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Reset form
      setFile(null);
      setError('');
    } catch (err) {
      setError('Error processing PDF: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Droplet className="w-12 h-12 text-indigo-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-800">PDF Watermark Pro</h1>
          </div>
          <p className="text-gray-600 text-lg">Add professional watermarks to your PDF documents</p>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-6 flex items-center text-gray-800">
              <Upload className="w-6 h-6 mr-2 text-indigo-600" />
              Upload PDF
            </h2>

            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="border-2 border-dashed border-indigo-300 rounded-lg p-12 text-center hover:border-indigo-500 transition-colors cursor-pointer bg-indigo-50"
            >
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <FileText className="w-16 h-16 mx-auto mb-4 text-indigo-400" />
                <p className="text-gray-600 mb-2">
                  {file ? file.name : 'Drag & drop your PDF here'}
                </p>
                <p className="text-sm text-gray-500">or click to browse</p>
              </label>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            {file && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-sm text-gray-700">{file.name}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Settings Section */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-6 flex items-center text-gray-800">
              <Settings className="w-6 h-6 mr-2 text-indigo-600" />
              Watermark Settings
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Footer Logo (Optional)
                </label>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleLogoChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                {logo && (
                  <p className="mt-2 text-sm text-green-600">✓ {logo.name}</p>
                )}
              </div>

              {logo && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo Opacity: {logoOpacity}
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.1"
                    value={logoOpacity}
                    onChange={(e) => setLogoOpacity(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Watermark Text
                </label>
                <input
                  type="text"
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter watermark text"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Position
                </label>
                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="diagonal-right-left">Diagonal (Right to Left)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Opacity: {opacity}
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={opacity}
                  onChange={(e) => setOpacity(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Font Size: {fontSize}px
                </label>
                <input
                  type="range"
                  min="20"
                  max="100"
                  step="5"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rotation: {rotation}°
                </label>
                <input
                  type="range"
                  min="-90"
                  max="90"
                  step="5"
                  value={rotation}
                  onChange={(e) => setRotation(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={!file || isProcessing}
                className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5 mr-2" />
                    Add Watermark & Download
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 max-w-6xl mx-auto">
          <h3 className="text-2xl font-semibold text-center mb-8 text-gray-800">Features</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Droplet className="w-6 h-6 text-indigo-600" />
              </div>
              <h4 className="font-semibold text-lg mb-2 text-gray-800">Custom Watermarks</h4>
              <p className="text-gray-600">Add personalized text watermarks with full customization options</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Settings className="w-6 h-6 text-indigo-600" />
              </div>
              <h4 className="font-semibold text-lg mb-2 text-gray-800">Flexible Settings</h4>
              <p className="text-gray-600">Control opacity, size, rotation, color, and position of watermarks</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Download className="w-6 h-6 text-indigo-600" />
              </div>
              <h4 className="font-semibold text-lg mb-2 text-gray-800">Instant Download</h4>
              <p className="text-gray-600">Process and download your watermarked PDFs instantly</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
