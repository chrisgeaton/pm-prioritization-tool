import React, { useState, useRef } from 'react';
import { Plus, Download, Trash2, Edit2, Check, X } from 'lucide-react';
import { Analytics } from "@vercel/analytics/react";
import './App.css';

const PrioritizationMatrix = () => {
  const [features, setFeatures] = useState([
    { id: 1, name: "User Authentication", impact: 8, effort: 6, editing: false },
    { id: 2, name: "Push Notifications", impact: 7, effort: 4, editing: false },
    { id: 3, name: "Dark Mode", impact: 3, effort: 2, editing: false },
    { id: 4, name: "Advanced Analytics", impact: 9, effort: 8, editing: false }
  ]);
  
  const [newFeature, setNewFeature] = useState({ name: '', impact: 5, effort: 5 });
  const [showAddForm, setShowAddForm] = useState(false);
  const matrixRef = useRef(null);

  const addFeature = () => {
    if (newFeature.name.trim()) {
      setFeatures([...features, {
        id: Date.now(),
        name: newFeature.name,
        impact: newFeature.impact,
        effort: newFeature.effort,
        editing: false
      }]);
      setNewFeature({ name: '', impact: 5, effort: 5 });
      setShowAddForm(false);
    }
  };

  const deleteFeature = (id) => {
    setFeatures(features.filter(f => f.id !== id));
  };

  const startEditing = (id) => {
    setFeatures(features.map(f => 
      f.id === id ? { ...f, editing: true, tempName: f.name, tempImpact: f.impact, tempEffort: f.effort } : f
    ));
  };

  const saveEdit = (id) => {
    setFeatures(features.map(f => 
      f.id === id ? { 
        ...f, 
        name: f.tempName, 
        impact: f.tempImpact, 
        effort: f.tempEffort, 
        editing: false 
      } : f
    ));
  };

  const cancelEdit = (id) => {
    setFeatures(features.map(f => 
      f.id === id ? { ...f, editing: false } : f
    ));
  };

  const updateTemp = (id, field, value) => {
    setFeatures(features.map(f => 
      f.id === id ? { ...f, [field]: value } : f
    ));
  };

  const getQuadrant = (impact, effort) => {
    if (impact >= 6 && effort <= 5) return { name: "Quick Wins", color: "bg-green-500", priority: "High Priority" };
    if (impact >= 6 && effort >= 6) return { name: "Major Projects", color: "bg-blue-500", priority: "Medium Priority" };
    if (impact <= 5 && effort <= 5) return { name: "Fill-ins", color: "bg-yellow-500", priority: "Low Priority" };
    return { name: "Thankless Tasks", color: "bg-red-500", priority: "Consider Dropping" };
  };

const exportImage = async () => {
  try {
    // Import html2canvas from installed package instead of CDN
    const html2canvas = (await import('html2canvas')).default;
    
    if (!matrixRef.current) return;
    
    // Create a container with the matrix and legend for export
    const exportContainer = document.createElement('div');
    exportContainer.style.background = 'white';
    exportContainer.style.padding = '20px';
    exportContainer.style.fontFamily = 'system-ui, -apple-system, sans-serif';
    
    // Clone the matrix
    const matrixClone = matrixRef.current.cloneNode(true);
    matrixClone.style.marginBottom = '20px';
    
    // Create title
    const title = document.createElement('h2');
    title.textContent = 'Feature Prioritization Matrix';
    title.style.textAlign = 'center';
    title.style.marginBottom = '10px';
    title.style.fontSize = '24px';
    title.style.fontWeight = 'bold';
    
    // Create subtitle
    const subtitle = document.createElement('p');
    subtitle.textContent = 'Impact vs Effort Analysis';
    subtitle.style.textAlign = 'center';
    subtitle.style.marginBottom = '20px';
    subtitle.style.color = '#666';
    
    // Create legend container
    const legendContainer = document.createElement('div');
    legendContainer.style.display = 'grid';
    legendContainer.style.gridTemplateColumns = 'repeat(2, 1fr)';
    legendContainer.style.gap = '10px';
    legendContainer.style.marginTop = '20px';
    
    const legendItems = [
      { name: 'Quick Wins', color: '#10b981', desc: 'High Impact, Low Effort - Do First!' },
      { name: 'Major Projects', color: '#3b82f6', desc: 'High Impact, High Effort - Plan Carefully' },
      { name: 'Fill-ins', color: '#eab308', desc: 'Low Impact, Low Effort - Spare Capacity' },
      { name: 'Thankless Tasks', color: '#ef4444', desc: 'Low Impact, High Effort - Consider Dropping' }
    ];
    
    legendItems.forEach(item => {
      const legendItem = document.createElement('div');
      legendItem.style.display = 'flex';
      legendItem.style.alignItems = 'center';
      legendItem.style.gap = '8px';
      legendItem.style.padding = '8px';
      legendItem.style.border = '1px solid #e5e7eb';
      legendItem.style.borderRadius = '8px';
      
      const colorBox = document.createElement('div');
      colorBox.style.width = '16px';
      colorBox.style.height = '16px';
      colorBox.style.backgroundColor = item.color;
      colorBox.style.borderRadius = '4px';
      
      const textContainer = document.createElement('div');
      const itemName = document.createElement('div');
      itemName.textContent = item.name;
      itemName.style.fontWeight = 'bold';
      itemName.style.fontSize = '14px';
      
      const itemDesc = document.createElement('div');
      itemDesc.textContent = item.desc;
      itemDesc.style.fontSize = '12px';
      itemDesc.style.color = '#666';
      
      textContainer.appendChild(itemName);
      textContainer.appendChild(itemDesc);
      legendItem.appendChild(colorBox);
      legendItem.appendChild(textContainer);
      legendContainer.appendChild(legendItem);
    });
    
    // Assemble export container
    exportContainer.appendChild(title);
    exportContainer.appendChild(subtitle);
    exportContainer.appendChild(matrixClone);
    exportContainer.appendChild(legendContainer);
    
    // Temporarily add to DOM for rendering
    exportContainer.style.position = 'absolute';
    exportContainer.style.left = '-9999px';
    exportContainer.style.width = '800px';
    document.body.appendChild(exportContainer);
    
    // Generate canvas
    const canvas = await html2canvas(exportContainer, {
      backgroundColor: '#ffffff',
      scale: 2,
      width: 800,
      height: 1000,
      useCORS: true,
      allowTaint: true
    });
    
    // Clean up
    document.body.removeChild(exportContainer);
    
    // Download image
    const link = document.createElement('a');
    link.download = 'prioritization-matrix.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    
  } catch (error) {
    console.error('Export failed:', error);
    alert('Export failed. Please try taking a screenshot instead.');
  }
};
  return (
    <div className="max-w-6xl mx-auto p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Feature Prioritization Matrix</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Visualize your product decisions with impact vs effort mapping. 
          Built by a PM who believes stakeholders understand pictures better than spreadsheets.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-6 justify-between items-center">
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          Add Feature
        </button>
        
        <button
          onClick={exportImage}
          className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <Download size={16} />
          Export Matrix
        </button>
      </div>

      {/* Add Feature Form */}
      {showAddForm && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6 border">
          <h3 className="font-semibold mb-3">Add New Feature</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Feature name"
              value={newFeature.name}
              onChange={(e) => setNewFeature({...newFeature, name: e.target.value})}
              className="px-3 py-2 border rounded-lg"
            />
            <div>
              <label className="block text-sm font-medium mb-1">Impact: {newFeature.impact}/10</label>
              <input
                type="range"
                min="1"
                max="10"
                value={newFeature.impact}
                onChange={(e) => setNewFeature({...newFeature, impact: parseInt(e.target.value)})}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Effort: {newFeature.effort}/10</label>
              <input
                type="range"
                min="1"
                max="10"
                value={newFeature.effort}
                onChange={(e) => setNewFeature({...newFeature, effort: parseInt(e.target.value)})}
                className="w-full"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={addFeature}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Add Feature
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Matrix */}
      <div ref={matrixRef} className="bg-white border-2 border-gray-300 relative" style={{ height: '600px', width: '100%' }}>
        {/* Grid Lines */}
        <div className="absolute inset-0">
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-300"></div>
          <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-300"></div>
        </div>

        {/* Quadrant Labels */}
        <div className="absolute top-2 left-2 text-sm font-semibold text-green-700 bg-green-100 px-2 py-1 rounded">
          Quick Wins<br/><span className="text-xs font-normal">High Impact, Low Effort</span>
        </div>
        <div className="absolute top-2 right-2 text-sm font-semibold text-blue-700 bg-blue-100 px-2 py-1 rounded">
          Major Projects<br/><span className="text-xs font-normal">High Impact, High Effort</span>
        </div>
        <div className="absolute bottom-2 left-2 text-sm font-semibold text-yellow-700 bg-yellow-100 px-2 py-1 rounded">
          Fill-ins<br/><span className="text-xs font-normal">Low Impact, Low Effort</span>
        </div>
        <div className="absolute bottom-2 right-2 text-sm font-semibold text-red-700 bg-red-100 px-2 py-1 rounded">
          Thankless Tasks<br/><span className="text-xs font-normal">Low Impact, High Effort</span>
        </div>

        {/* Axis Labels */}
        <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-6 text-sm font-semibold text-gray-700">
          Effort →
        </div>
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-8 -rotate-90 text-sm font-semibold text-gray-700">
          Impact →
        </div>

        {/* Features */}
        {features.map((feature) => {
          const quadrant = getQuadrant(feature.impact, feature.effort);
          const x = ((feature.effort - 1) / 9) * 100;
          const y = ((10 - feature.impact) / 9) * 100;
          
          return (
            <div
              key={feature.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              {feature.editing ? (
                <div className="bg-white border-2 border-blue-500 rounded-lg p-2 shadow-lg min-w-48">
                  <input
                    type="text"
                    value={feature.tempName}
                    onChange={(e) => updateTemp(feature.id, 'tempName', e.target.value)}
                    className="w-full text-xs border rounded px-1 py-1 mb-1"
                  />
                  <div className="text-xs mb-1">
                    Impact: {feature.tempImpact}
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={feature.tempImpact}
                      onChange={(e) => updateTemp(feature.id, 'tempImpact', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div className="text-xs mb-2">
                    Effort: {feature.tempEffort}
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={feature.tempEffort}
                      onChange={(e) => updateTemp(feature.id, 'tempEffort', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => saveEdit(feature.id)}
                      className="flex-1 bg-green-500 text-white text-xs py-1 rounded flex items-center justify-center"
                    >
                      <Check size={12} />
                    </button>
                    <button
                      onClick={() => cancelEdit(feature.id)}
                      className="flex-1 bg-gray-500 text-white text-xs py-1 rounded flex items-center justify-center"
                    >
                      <X size={12} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className={`${quadrant.color} text-white px-3 py-2 rounded-lg shadow-md cursor-pointer min-w-32 text-center relative`}>
                  <div className="font-semibold text-sm">{feature.name}</div>
                  <div className="text-xs opacity-90">I:{feature.impact} E:{feature.effort}</div>
                  
                  {/* Action buttons - show on hover */}
                  <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <button
                      onClick={() => startEditing(feature.id)}
                      className="bg-white text-gray-700 p-1 rounded-full shadow-md hover:bg-gray-100"
                    >
                      <Edit2 size={12} />
                    </button>
                    <button
                      onClick={() => deleteFeature(feature.id)}
                      className="bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-green-50 p-3 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="font-semibold text-green-800">Quick Wins</span>
          </div>
          <p className="text-xs text-green-700">Do these first! High impact, low effort.</p>
        </div>
        
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="font-semibold text-blue-800">Major Projects</span>
          </div>
          <p className="text-xs text-blue-700">Plan carefully. High impact but significant effort.</p>
        </div>
        
        <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span className="font-semibold text-yellow-800">Fill-ins</span>
          </div>
          <p className="text-xs text-yellow-700">Nice to have when you have spare capacity.</p>
        </div>
        
        <div className="bg-red-50 p-3 rounded-lg border border-red-200">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="font-semibold text-red-800">Thankless Tasks</span>
          </div>
          <p className="text-xs text-red-700">Consider dropping or redesigning these.</p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-gray-500 border-t pt-4">
        <p>Built for PMs who believe in the power of visual communication. Share your prioritization story clearly.</p>
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <PrioritizationMatrix />
      <Analytics />
    </div>
  );
}

export default App;
