import mongoose from 'mongoose';

const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  contractAddress: {
    type: String,
    required: true,
  },
});

const Store = mongoose.models.Store || mongoose.model('Store', storeSchema);

export default Store;
