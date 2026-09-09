// Kept only for backward compatibility with any older imports.
// Single source of truth is ENV in ./environment.ts — do not hardcode
// credentials in more than one place.
import { ENV } from './environment';

export const credentials = {
  username: ENV.ADMIN_USERNAME,
  password: ENV.ADMIN_PASSWORD,
};
