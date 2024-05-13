import type { Schema, Attribute } from '@strapi/strapi';

export interface GradeZero extends Schema.Component {
  collectionName: 'components_grade_zeros';
  info: {
    displayName: 'Grade';
    icon: 'hashtag';
    description: '';
  };
  attributes: {
    gradeValue: Attribute.Integer;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'grade.zero': GradeZero;
    }
  }
}
