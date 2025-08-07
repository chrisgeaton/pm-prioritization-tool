import React, { useState, useRef } from 'react';
import { Plus, Download, Trash2, Edit2, Check, X } from 'lucide-react';
import { Analytics } from "@vercel/analytics/react";
import './App.css';

const PrioritizationMatrix = () => {
  const [features, setFeatures] = useState([
    { id: 1, name: "User Authentication", impact: 8, effort: 6, editing: false },
    { id: 2, name: "Push Notifications", impact: 7, effort: 4, editing: false },
    { id: 3, name: "Dark Mode", impact: 3, effort: 2, editing: false },
    { id: 4, name: "Advanced Analytics", impact: 9, effort: 8, editing: false },
    { id: 5, name: "Dashboard Rewrite", impact: 4, effort: 9, editing: false }
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
      f.id === id
        ? {
            ...f,
            name: f.tempName,
            impact: f.tempImpact,
            effort: f.tempEffort,
            editing: false
          }
        : f
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
      const html2canvas = (await import('html2canvas')).default;
      if (!matrixRef.current) return;

      const exportContainer = document.createElement('div');
      exportContainer.style.background = 'white';
      exportContainer.style.padding = '20px';
      exportContainer.style.fontFamily = 'system-ui, -apple-system, sans-serif';

      const matrixClone = matrixRef.current.cloneNode(true);
      matrixClone.style.marginBottom = '20px';

      const title = document.createElement('h2');
      title.textContent = 'Feature Prioritization Matrix';
      title.style.textAlign = 'center';
      title.style.marginBottom = '10px';
      title.style.fontSize = '24px';
      title.style.fontWeight = 'bold';

      const subtitle = document.createElement('p');
      subtitle.textContent = 'Impact vs Effort Analysis';
      subtitle.style.textAlign = 'center';
      subtitle.style.marginBottom = '20px';
      subtitle.style.color = '#666';

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

      exportContainer.appendChild(title);
      exportContainer.appendChild(subtitle);
      exportContainer.appendChild(matrixClone);
      exportContainer.appendChild(legendContainer);

      exportContainer.style.position = 'absolute';
      exportContainer.style.left = '-9999px';
      exportContainer.style.width = '1200px';
      document.body.appendChild(exportContainer);

      const canvas = await html2canvas(exportContainer, {
        backgroundColor: '#ffffff',
        scale: 2,
        width: 1200,
        height: 1200,
        useCORS: true,
        allowTaint: true
      });

      document.body.removeChild(exportContainer);

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
      {/* Add / Export Buttons */}
      <div className="flex justify-between mb-6">
        <button onClick={() => setShowAddForm(true)} className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2">
          <Plus size={16} /> Add Feature
        </button>
        <button onClick={exportImage} className="bg-gray-600 text-white px-4 py-2 rounded flex items-center gap-2">
          <Download size={16} /> Export Matrix
        </button>
      </div>

      {/* Feature Form */}
      {showAddForm && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6 border">
          <h3 className="font-semibold mb-3">Add New Feature</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Feature name"
              value={newFeature.name}
              onChange={(e) => setNewFeature({ ...newFeature, name: e.target.value })}
              className="px-3 py-2 border rounded-lg"
            />
            <div>
              <label className="block text-sm font-medium mb-1">Impact: {newFeature.impact}/10</label>
              <input
                type="range"
                min="1"
                max="10"
                value={newFeature.impact}
                onChange={(e) => setNewFeature({ ...newFeature, impact: parseInt(e.target.value) })}
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
                onChange={(e) => setNewFeature({ ...newFeature, effort: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={addFeature} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Add Feature
            </button>
            <button onClick={() => setShowAddForm(false)} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Matrix */}
      <div ref={matrixRef} className="relative bg-white border h-[600px] w-full">
        {/* You can insert quadrant labels and the rest of your matrix UI here */}
        {/* This was truncated due to length — reuse your full matrix rendering f*
