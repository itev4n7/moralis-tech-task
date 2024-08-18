import { test as setup } from 'common/fixtures';
import { ADMIN_CREDENTIALS, MORALIS_API_FILE } from '../common/constants';
import fs from 'fs/promises';
import { MoralisAPITokens } from 'common/types';

setup('Authenticate as admin', async ({ moralisAdminApp }) => {
  await moralisAdminApp.loginPage.signInIntoAdminApp(ADMIN_CREDENTIALS);
  const token = await moralisAdminApp.homePage.returnMoralisAPIToken();
  const tokenData: MoralisAPITokens = { moralisAPIToken: token };
  await fs.writeFile(MORALIS_API_FILE, JSON.stringify(tokenData));
});
