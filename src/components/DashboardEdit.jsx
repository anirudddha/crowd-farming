import React from 'react';

const DashboardEdit = ({ editedCampaign, handleEditChange, handleVisualsChange, saveEdits, closeModal }) => {
  // Guard clause: If the campaign data isn't loaded yet, render nothing or a loader.
  if (!editedCampaign) {
    return (
        <div className="p-8 text-center text-gray-500">
            Loading editor...
        </div>
    );
  }

  // A specific handler for cropTypes to convert the array to a string and back
  const handleCropTypesChange = (e) => {
    const { name, value } = e.target;
    // Split the comma-separated string back into an array of strings
    const cropTypesArray = value.split(',').map(item => item.trim()).filter(Boolean);
    handleEditChange({ target: { name, value: cropTypesArray } });
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); saveEdits(); }} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Column */}
      <div className="space-y-4">
        <Section title="Core Campaign Info">
          <FormInput label="Campaign Title" name="campaignTitle" value={editedCampaign.campaignTitle || ''} onChange={handleEditChange} />
          <FormTextarea label="Campaign Story" name="story" value={editedCampaign.story || ''} onChange={handleEditChange} rows={5} />
          <FormInput label="Farm Name" name="farmName" value={editedCampaign.farmName || ''} onChange={handleEditChange} />
          <FormInput label="Farm Location" name="farmLocation" value={editedCampaign.farmLocation || ''} onChange={handleEditChange} />
        </Section>

        <Section title="Financials & Status">
          <FormInput type="number" label="Funding Goal (₹)" name="fundingGoal" value={editedCampaign.fundingGoal || 0} onChange={handleEditChange} />
          <FormInput type="number" label="Minimum Investment (₹)" name="minInvestment" value={editedCampaign.minInvestment || 0} onChange={handleEditChange} />
           <FormSelect label="Campaign Status" name="status" value={editedCampaign.status || 'Active'} onChange={handleEditChange}>
            <option value="Draft">Draft</option>
            <option value="Active">Active</option>
            <option value="Funded">Funded</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </FormSelect>
           <div className="p-3 bg-gray-100 rounded-md">
                <p className="text-sm font-medium text-gray-600">Verification Status</p>
                <p className={`text-lg font-bold ${editedCampaign.isVerified ? 'text-green-600' : 'text-red-600'}`}>
                    {editedCampaign.isVerified ? 'Verified' : 'Not Verified'}
                </p>
            </div>
        </Section>

        <Section title="Expected Returns">
          <FormSelect label="Return Type" name="expectedReturns.type" value={editedCampaign.expectedReturns?.type || 'Percentage Range'} onChange={handleEditChange}>
            <option value="Percentage Range">Percentage Range</option>
            <option value="Fixed Multiple">Fixed Multiple</option>
          </FormSelect>
          <FormInput type="number" label="Min Return (Value or %)" name="expectedReturns.min" value={editedCampaign.expectedReturns?.min || 0} onChange={handleEditChange} />
          {editedCampaign.expectedReturns?.type === 'Percentage Range' && (
            <FormInput type="number" label="Max Return (%)" name="expectedReturns.max" value={editedCampaign.expectedReturns?.max || 0} onChange={handleEditChange} />
          )}
          <FormTextarea label="Return Description" name="expectedReturns.description" value={editedCampaign.expectedReturns?.description || ''} onChange={handleEditChange} />
        </Section>
      </div>

      {/* Right Column */}
      <div className="space-y-4">
        <Section title="Farm & Crop Details">
           <div className="flex gap-4">
             <FormInput type="number" label="Farm Size" name="farmSize.value" value={editedCampaign.farmSize?.value || 0} onChange={handleEditChange} />
             <FormSelect label="Unit" name="farmSize.unit" value={editedCampaign.farmSize?.unit || 'Acres'} onChange={handleEditChange}>
               <option value="Acres">Acres</option>
               <option value="Hectares">Hectares</option>
             </FormSelect>
           </div>
          {/* Use the specific handler for crop types */}
          <FormTextarea label="Crop Types (comma-separated)" name="cropTypes" value={Array.isArray(editedCampaign.cropTypes) ? editedCampaign.cropTypes.join(', ') : ''} onChange={handleCropTypesChange} />
          <FormInput label="Farming Methods" name="farmingMethods" value={editedCampaign.farmingMethods || ''} onChange={handleEditChange} />
        </Section>

        <Section title="Additional Details">
            <FormTextarea label="Fund Usage Breakdown" name="fundUsage" value={editedCampaign.fundUsage || ''} onChange={handleEditChange} rows={4} />
            <FormTextarea label="Impact Metrics" name="impactMetrics" value={editedCampaign.impactMetrics || ''} onChange={handleEditChange} rows={4} />
            <FormTextarea label="Risk Factors" name="riskFactors" value={editedCampaign.riskFactors || ''} onChange={handleEditChange} rows={4} />
        </Section>
        
        <Section title="Timeline">
          <FormInput type="date" label="Start Date" name="startDate" value={(editedCampaign.startDate || '').split('T')[0]} onChange={handleEditChange} />
          <FormInput type="date" label="End Date" name="endDate" value={(editedCampaign.endDate || '').split('T')[0]} onChange={handleEditChange} />
        </Section>

        <Section title="Visuals">
          <div className="grid grid-cols-3 gap-2">
            {editedCampaign.visuals?.map((visual, index) => (
              <div key={visual.public_id || index} className="relative group">
                <img src={visual.url} alt={`Visual ${index + 1}`} className="w-full h-24 object-cover rounded-lg border" />
                <button
                  type="button"
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => {
                    const updatedVisuals = editedCampaign.visuals.filter((_, i) => i !== index);
                    handleVisualsChange({ visuals: updatedVisuals });
                  }}
                >
                  ✖
                </button>
              </div>
            ))}
            {editedCampaign.newVisuals?.map((file, index) => (
               <div key={file.name + index} className="relative group p-2 border rounded-md h-24 flex flex-col justify-center items-center bg-gray-50">
                    <p className="text-xs text-center truncate w-full">{file.name}</p>
                     <button type="button" className="mt-1 text-red-500 text-xs" onClick={() => {
                        const updatedFiles = editedCampaign.newVisuals.filter((_, i) => i !== index);
                        handleVisualsChange({ newVisuals: updatedFiles });
                      }}>Remove</button>
                </div>
            ))}
          </div>
          <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Add New Visuals</label>
              <input
                type="file" multiple accept="image/*"
                onChange={(e) => {
                  if (e.target.files.length > 0) {
                    const newFiles = Array.from(e.target.files);
                    const updatedFiles = editedCampaign.newVisuals ? [...editedCampaign.newVisuals, ...newFiles] : newFiles;
                    handleVisualsChange({ newVisuals: updatedFiles });
                  }
                }}
                className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
        </Section>
      </div>

      {/* Save and Cancel Buttons */}
      <div className="lg:col-span-full border-t pt-6">
        <div className="flex justify-end space-x-3">
          <button type="button" onClick={closeModal} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
            Cancel
          </button>
          <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Save Changes
          </button>
        </div>
      </div>
    </form>
  );
};


// --- Helper Components (No changes needed) ---

const Section = ({ title, children }) => (
  <div className="bg-white p-4 rounded-lg border border-gray-200">
    <h4 className="text-lg font-semibold text-gray-800 mb-4">{title}</h4>
    <div className="space-y-4">{children}</div>
  </div>
);

const FormInput = ({ label, type = 'text', name, value, onChange }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type} id={name} name={name} value={value} onChange={onChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />
  </div>
);

const FormTextarea = ({ label, name, value, onChange, rows = 3 }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <textarea
      id={name} name={name} value={value} onChange={onChange} rows={rows}
      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />
  </div>
);

const FormSelect = ({ label, name, value, onChange, children }) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        id={name} name={name} value={value} onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {children}
      </select>
    </div>
);

export default DashboardEdit;