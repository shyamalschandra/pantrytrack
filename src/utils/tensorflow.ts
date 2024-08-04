import * as mobilenet from '@tensorflow-models/mobilenet';
import '@tensorflow/tfjs';

export const classifyImage = async (imageElement: HTMLImageElement) => {
  const model = await mobilenet.load();
  const predictions = await model.classify(imageElement);
  return predictions.map(prediction => prediction.className);
};
