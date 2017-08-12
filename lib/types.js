const YAML = require('yamljs');

/**
 * Create a new slot type and add it to the list
 * @param typeList - the list to add the created type to
 * @param typeName - the name of the new type
 * @return {{name: *, values: Array}} type object
 */
exports.createNewSlotType = (typeList, typeName) => {
  'use strict';
  const newType = {
    name: typeName,
    values: []
  };
  typeList.push(newType);
  return newType;
};

/**
 * Reads the types.yaml file and returns a promise that resolves to the list of types
 * @return {Promise.<Array>} the type list
 */
exports.readTypesFromYAML = () => {
  'use strict';
  let typeList = [];
  
  //load types.yaml and generate types
  let typeConfig = YAML.load('types.yaml');
  
  for (let key in typeConfig) {
    if (typeConfig.hasOwnProperty(key)) {
      let type = exports.createNewSlotType(typeList, key);
      let config = typeConfig[key];
      
      for (let id in config) {
        if (config.hasOwnProperty(id)) {
          type.values.push({
            id: id,
            name: {
              value: config[id][0].toLowerCase(),
              synonyms: config[id].map(val => val.toLowerCase())
            }
          });
        }
      }
    }
  }
  return Promise.resolve(typeList);
};