import React from 'react';
import { FiUser } from 'react-icons/fi';

const CustomerDetailsCard = ({ address }) => (
  <div className="bg-emerald-50 p-4 rounded-lg border-2 border-emerald-200">
    <h3 className="font-semibold mb-3 flex items-center text-emerald-800">
      <FiUser className="mr-2" /> Customer Details
    </h3>
    <dl className="space-y-2 text-sm text-emerald-900/80">
      <div>
        <dt className="font-medium text-emerald-900">Name</dt>
        <dd>{address.name}</dd>
      </div>
      <div>
        <dt className="font-medium text-emerald-900">Contact</dt>
        <dd>{address.phone}</dd>
      </div>
      <div>
        <dt className="font-medium text-emerald-900">Address</dt>
        <dd>
          {address.street || address.addressLine1},<br />
          {address.city}, {address.state} {address.zipcode}, {address.country}
        </dd>
      </div>
    </dl>
  </div>
);

export default CustomerDetailsCard;