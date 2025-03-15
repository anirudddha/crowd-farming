import React from 'react';

const DashboardEdit = ({ editedCampaign, handleEditChange, saveEdits, closeModal }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
                <Section title="Basic Information">
                    <FormInput
                        label="Campaign Title"
                        name="campaignTitle"
                        value={editedCampaign.campaignTitle}
                        onChange={handleEditChange}
                    />
                    <FormInput
                        label="Farmer Name"
                        name="farmerName"
                        value={editedCampaign.farmerName}
                        onChange={handleEditChange}
                    />
                    <FormInput
                        label="Farm Location"
                        name="farmLocation"
                        value={editedCampaign.farmLocation}
                        onChange={handleEditChange}
                    />
                </Section>

                <Section title="Financial Targets">
                    <FormInput
                        type="number"
                        label="Funding Goal ($)"
                        name="fundingGoal"
                        value={editedCampaign.fundingGoal}
                        onChange={handleEditChange}
                    />
                    <FormInput
                        type="number"
                        label="Minimum Investment ($)"
                        name="minInvestment"
                        value={editedCampaign.minInvestment}
                        onChange={handleEditChange}
                    />
                    <FormInput
                        label="Expected Returns (%)"
                        name="expectedReturns"
                        value={editedCampaign.expectedReturns}
                        onChange={handleEditChange}
                    />
                </Section>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
                <Section title="Campaign Details">
                    <FormInput
                        type="date"
                        label="Start Date"
                        name="startDate"
                        value={editedCampaign.startDate.split('T')[0]}
                        onChange={handleEditChange}
                    />
                    <FormInput
                        type="date"
                        label="End Date"
                        name="endDate"
                        value={editedCampaign.endDate.split('T')[0]}
                        onChange={handleEditChange}
                    />
                    <FormInput
                        label="Crop Types"
                        name="cropTypes"
                        value={editedCampaign.cropTypes}
                        onChange={handleEditChange}
                    />
                </Section>

                <Section title="Visuals & Documentation">
                    <div className="grid grid-cols-2 gap-4">
                        {editedCampaign.visuals?.map((visual, index) => (
                            <div key={index} className="relative group">
                                {visual.url ? (
                                    <>
                                        <img
                                            src={visual.url}
                                            alt={`Visual ${index}`}
                                            className="w-full h-24 object-cover rounded-lg border"
                                        />
                                        <button
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => {
                                                const newVisuals = [...editedCampaign.visuals];
                                                newVisuals.splice(index, 1);
                                                handleEditChange({ target: { name: 'visuals', value: newVisuals } });
                                            }}
                                        >
                                            ✖
                                        </button>
                                    </>
                                ) : (
                                    <input
                                        type="text"
                                        value={visual}
                                        onChange={(e) => {
                                            const newVisuals = [...editedCampaign.visuals];
                                            newVisuals[index] = e.target.value;
                                            handleEditChange({ target: { name: 'visuals', value: newVisuals } });
                                        }}
                                        className="w-full px-3 py-2 border rounded-md text-sm"
                                    />
                                )}
                            </div>
                        ))}
                        <div className="col-span-full">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                            const newVisuals = editedCampaign.visuals ? [...editedCampaign.visuals] : [];
                                            newVisuals.push(reader.result);
                                            handleEditChange({ target: { name: 'visuals', value: newVisuals } });
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }}
                                className="text-sm text-gray-600"
                            />
                        </div>
                    </div>
                </Section>
            </div>

            {/* Save and Cancel Buttons */}
            <div className="col-span-full border-t pt-6">
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={closeModal}
                        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={saveEdits}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

const Section = ({ title, children }) => (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h4 className="text-sm font-semibold text-gray-800 mb-3">{title}</h4>
        {children}
    </div> 
);



const FormInput = ({ label, type = 'text', ...props }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      {...props}
      className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />
  </div>
);


export default DashboardEdit;
