import { WebContainer } from '@webcontainer/api';

let webcontainerInstance;

export const getWebContainer = async () => {
  if (!webcontainerInstance) {
    webcontainerInstance = await WebContainer.boot();
  }
  return webcontainerInstance;
};

export const createWebContainer = async () => {
  const webcontainer = await getWebContainer();
  return webcontainer;
};
