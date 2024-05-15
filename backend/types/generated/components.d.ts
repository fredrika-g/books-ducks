import type { Schema, Attribute } from '@strapi/strapi';

export interface GradesGradedBook extends Schema.Component {
  collectionName: 'components_grades_graded_books';
  info: {
    displayName: 'Graded Book';
    icon: 'book';
    description: '';
  };
  attributes: {
    myGrade: Attribute.Integer;
    book: Attribute.Relation<
      'grades.graded-book',
      'oneToOne',
      'api::book.book'
    >;
    bookId: Attribute.Integer;
  };
}

export interface GradesTestgrade extends Schema.Component {
  collectionName: 'components_test_grade_testgrades';
  info: {
    displayName: 'Grade';
    icon: 'book';
    description: '';
  };
  attributes: {
    grade: Attribute.JSON;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'grades.graded-book': GradesGradedBook;
      'grades.testgrade': GradesTestgrade;
    }
  }
}
