export type MapEngine = 'openlayers' | 'cesium';

export interface MapLayerConfig {
  /**
   * Base URL of the Web Map Service endpoint (e.g. http://localhost:8080/geoserver/wms).
   */
  wmsUrl: string;
  /**
   * Qualified layer name to request from the WMS server.
   */
  layerName: string;
  /**
   * Output image format requested from the server.
   */
  format: string;
  /**
   * Whether the requested tiles should be transparent when rendered.
   */
  transparent: boolean;
}
