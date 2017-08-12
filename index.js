/*
 * Copyright (c) 2017. Taimos GmbH http://www.taimos.de
 */

const fs = require('fs');
const intentLib = require('./lib/intents');
const typeLib = require('./lib/types');

// Intents
/**
 * Create a new intent and add it to the list
 * @param intentList - the list to add the created intent to
 * @param intentName - the name of the new intent
 * @return {{name: *, values: Array}} intent object
 */
exports.createNewIntent = intentLib.createNewIntent;

/**
 * Add a new slot to the given intent
 * @param intent - the intent to add the slot to
 * @param name - the slot name
 * @param type - the slot type
 * @return {{name: *, type: *, samples: Array}} the created slot
 */
exports.addSlotToIntent = intentLib.addSlotToIntent;

/**
 * Reads the intents.yaml file and returns a promise that resolves to the list of intents
 * @return {Promise.<Array>} the intent list
 */
exports.readIntentsFromYAML = intentLib.readIntentsFromYAML;

// Slot Types
/**
 * Create a new slot type and add it to the list
 * @param typeList - the list to add the created type to
 * @param typeName - the name of the new type
 * @return {{name: *, values: Array}} type object
 */
exports.createNewSlotType = typeLib.createNewSlotType;

/**
 * Reads the types.yaml file and returns a promise that resolves to the list of types
 * @return {Promise.<Array>} the type list
 */
exports.readTypesFromYAML = typeLib.readTypesFromYAML;

// VUI generation
/**
 * Create the voice interface
 * @param intentCreator - the function creating the intents
 * @param typeCreator - the function creating the slot types
 * @param fileName - (optional) the target file name
 * @return {Promise.<VoiceInterface>}
 */
exports.createVoiceInterface = (intentCreator, typeCreator, fileName) => {
  'use strict';
  
  //Base content with dummy intent to activate dialog model
  let vui = {
    prompts: [
      {
        id: 'Elicit.Intent-DialogActivationDummyIntent.IntentSlot-dummy',
        promptVersion: '1.0',
        definitionVersion: '1.0',
        variations: [
          {
            type: 'PlainText',
            value: 'Dummy question'
          }
        ]
      }
    ],
    dialog: {
      version: '1.0',
      intents: [
        {
          name: 'DialogActivationDummyIntent',
          confirmationRequired: false,
          prompts: {},
          slots: [
            {
              name: 'dummy',
              type: 'AMAZON.NUMBER',
              elicitationRequired: true,
              confirmationRequired: false,
              prompts: {
                elicit: 'Elicit.Intent-DialogActivationDummyIntent.IntentSlot-dummy'
              }
            }
          ]
        }
      ]
    }
  };
  
  let generationPromise = Promise.all([
    intentCreator().then(intents => {
      vui.intents = intents;
    }),
    typeCreator().then(types => {
      vui.types = types;
    })
  ]).then(() => {
    return Promise.resolve(vui);
  });
  
  if (fileName) {
    return generationPromise.then(vui => {
      fs.writeFileSync(fileName, JSON.stringify(vui, null, 2));
      return vui;
    });
  }
  return generationPromise;
};
