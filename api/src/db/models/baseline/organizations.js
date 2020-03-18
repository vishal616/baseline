import mongoose from 'mongoose';

const OrganizationsSchema = new mongoose.Schema({
  _id: {
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  role: {
    type: Number,
    required: true,
  },
  identity: {
    type: String,
    required: true,
  },
  zkpPublicKey: {
    type: String,
    required: true,
  },
  isPartner: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const Organization = mongoose.model('organizations', OrganizationsSchema);

export const getOrganizationById = async address => {
  const organization = await Organization.findOne({ _id: address });
  return organization;
};

export const getAllOrganizations = async () => {
  const organizations = await Organization.find({});
  return organizations;
};

export const saveOrganization = async input => {
  const organization = await Organization.updateOne(
    { _id: input.address },
    { $set: input },
    { upsert: true },
  );
  console.log('Adding Organization:', input);
  return organization;
};

export const getPartnerByAddress = async address => {
  const partner = await Organization.find({ _id: address, isPartner: true });
  return partner;
};

export const getPartnerByIdentity = async identity => {
  const partner = await Organization.findOne({ identity: identity, isPartner: true });
  if (!partner) {
    console.log(`Organization may not be set as partner: ${identity}`);
  }
  return partner || null;
};

export const getAllPartners = async () => {
  const partners = await Organization.find({ isPartner: true });
  return partners;
};

export const setPartner = async (address, state = true) => {
  const organization = await Organization.findById(address);
  organization.isPartner = state;
  await organization.save();
  return organization;
};

export default {
  getPartnerByAddress,
  getPartnerByIdentity,
  getAllPartners,
  setPartner,
  getOrganizationById,
  getAllOrganizations,
  saveOrganization,
};
