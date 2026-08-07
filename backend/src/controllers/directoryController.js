import { Directory } from '../models/Directory.js';
import mongoose from 'mongoose';

/**
 * GET /api/directory
 * Query Params:
 *  - type: filter by type (KCC, CSC, SHG)
 *  - district: filter by district (e.g. Nagaur, Jaipur, or matches "All"/"All-India")
 *  - state: filter by state
 *  - search: search keyword in name, address, or phone
 */
export const getDirectoryEntries = async (req, res) => {
  try {
    const { type, district, state, search } = req.query;
    const filter = {};

    // Filter by type (KCC, CSC, SHG, etc.)
    if (type) {
      filter.type = new RegExp(`^${type.trim()}$`, 'i');
    }

    // Filter by district (include specific district OR all-India / state-wide general entries)
    if (district) {
      const distClean = district.trim();
      filter.$or = [
        { district: new RegExp(`^${distClean}$`, 'i') },
        { district: /^all/i },
        { district: /^national/i }
      ];
    }

    // Filter by state
    if (state) {
      const stateClean = state.trim();
      if (!filter.$or) filter.$or = [];
      filter.state = new RegExp(`^${stateClean}$|^all|^national`, 'i');
    }

    // Keyword search
    if (search) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$and = filter.$and || [];
      filter.$and.push({
        $or: [
          { name: searchRegex },
          { address: searchRegex },
          { phone: searchRegex },
          { district: searchRegex }
        ]
      });
    }

    let entries = await Directory.find(filter).sort({ name: 1 });

    // Fallback: If no results found in 'directories', check unpluralized 'directory' collection directly
    if (entries.length === 0) {
      const rawCollection = mongoose.connection.db.collection('directory');
      const rawCount = await rawCollection.countDocuments();
      if (rawCount > 0) {
        entries = await rawCollection.find(filter).toArray();
      }
    }

    res.status(200).json({
      success: true,
      count: entries.length,
      data: entries
    });
  } catch (error) {
    console.error('[directoryController] Error fetching directory entries:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch directory entries',
      error: error.message
    });
  }
};

/**
 * GET /api/directory/:id
 */
export const getDirectoryById = async (req, res) => {
  try {
    const { id } = req.params;

    let entry = await Directory.findById(id);

    if (!entry) {
      // Fallback check on raw 'directory' collection
      const rawCollection = mongoose.connection.db.collection('directory');
      if (mongoose.Types.ObjectId.isValid(id)) {
        entry = await rawCollection.findOne({ _id: new mongoose.Types.ObjectId(id) });
      }
    }

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: `Directory entry with ID '${id}' not found`
      });
    }

    res.status(200).json({
      success: true,
      data: entry
    });
  } catch (error) {
    console.error('[directoryController] Error fetching directory entry by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch directory entry details',
      error: error.message
    });
  }
};
