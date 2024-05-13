'use strict';

/**
 * grade service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::grade.grade');
