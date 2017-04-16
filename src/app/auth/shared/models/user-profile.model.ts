import { AppMetadata } from './app-metadata.model';
import { UserMetadata } from './user-metadata.model';

export interface UserProfile extends auth0.Auth0UserProfile {
  user_metadata: UserMetadata;
  app_metadata: AppMetadata;
}
