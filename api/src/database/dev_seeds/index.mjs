import disease from './disease.mjs'; export { disease }
import finance from './finance.mjs'; export { finance }
import owner from './owner.mjs'; export { owner }
import pet from './pet.mjs'; export { pet }
import pet_timeline from './pet_timeline.mjs'; export { pet_timeline }
import vaccine from './vaccine.mjs'; export { vaccine }

export default async () => {
  await disease()
  await finance()
  await owner()
  await pet()
  await pet_timeline()
  await vaccine()
}
