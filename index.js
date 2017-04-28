import ConfigCollector from './lib/ConfigCollector';
import DefaultGridTemplate from './lib/DefaultGridTemplate'
import { buildGridWithTemplate } from './lib/GridBuilder'

const DefaultGrid = buildGridWithTemplate(DefaultGridTemplate)

export {
  ConfigCollector,
  buildGridWithTemplate,
  DefaultGrid
}