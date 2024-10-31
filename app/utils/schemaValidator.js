function validateSchema(data, schema) {
    for (const [key, value] of Object.entries(schema)) {
      if (value.required && !(key in data)) {
        throw new Error(`Missing required field: ${key}`);
      }
      if (key in data) {
        if (value.type === 'array' && !Array.isArray(data[key])) {
          throw new Error(`Field ${key} must be an array`);
        }
        if (value.type === 'number' && typeof data[key] !== 'number') {
          throw new Error(`Field ${key} must be a number`);
        }
        if (value.type === 'string' && typeof data[key] !== 'string') {
          throw new Error(`Field ${key} must be a string`);
        }
        if (value.type === 'date' && !(data[key] instanceof Date)) {
          throw new Error(`Field ${key} must be a date`);
        }
        if (value.type === 'ObjectId' && typeof data[key] !== 'string') {
          throw new Error(`Field ${key} must be a string (ObjectId)`);
        }
        if (value.minimum !== undefined && data[key] < value.minimum) {
          throw new Error(`Field ${key} must be at least ${value.minimum}`);
        }
        if (value.maximum !== undefined && data[key] > value.maximum) {
          throw new Error(`Field ${key} must be at most ${value.maximum}`);
        }
      }
    }
    return true;
  }
  
  module.exports = validateSchema;