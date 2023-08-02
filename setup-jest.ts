import 'jest-preset-angular/setup-jest';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';

export default {
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
};
