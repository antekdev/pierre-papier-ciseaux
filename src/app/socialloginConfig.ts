import {AuthServiceConfig, FacebookLoginProvider} from 'angular-6-social-login-v2';
import {VkontakteLoginProvider, GoogleLoginProvider} from 'angular-6-social-login-v2';

export function getAuthServiceConfigs()
{
  return new AuthServiceConfig([
    {
      id: FacebookLoginProvider.PROVIDER_ID,
      provider: new FacebookLoginProvider("742432606120757")
    },
    {
      id: VkontakteLoginProvider.PROVIDER_ID,
      provider: new VkontakteLoginProvider("6846104")
    },
    {
      id: GoogleLoginProvider.PROVIDER_ID,
      provider: new GoogleLoginProvider("240437445041-sfhiqu4kbrf2u3kd8vd0q8mu923jgqkv.apps.googleusercontent.com")
    },
  ]);
}
