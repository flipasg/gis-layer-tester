import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import { defaults as defaultControls } from 'ol/control/defaults';
import TileLayer from 'ol/layer/Tile';
import { fromLonLat } from 'ol/proj';
import OSM from 'ol/source/OSM';
import TileWMS from 'ol/source/TileWMS';
import { MapLayerConfig } from '../../../../core/models/map-layer-config';

@Component({
  selector: 'app-openlayers-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './openlayers-map.component.html',
  styleUrl: './openlayers-map.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpenlayersMapComponent
  implements AfterViewInit, OnChanges, OnDestroy
{
  @Input({ required: true }) config!: MapLayerConfig;
  @ViewChild('mapContainer', { static: true })
  private readonly mapContainer!: ElementRef<HTMLDivElement>;

  private map?: Map;
  private wmsLayer?: TileLayer<TileWMS>;

  ngAfterViewInit(): void {
    this.initializeMap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config'] && !changes['config'].firstChange) {
      this.updateWmsLayer();
    }
  }

  ngOnDestroy(): void {
    this.map?.setTarget(undefined);
  }

  private initializeMap(): void {
    if (this.map) {
      return;
    }

    const layers: TileLayer<any>[] = [new TileLayer({ source: new OSM() })];

    if (this.config.layerName && this.config.wmsUrl) {
      this.wmsLayer = this.createWmsLayer();
      layers.push(this.wmsLayer);
    }

    this.map = new Map({
      target: this.mapContainer.nativeElement,
      layers,
      controls: defaultControls(),
      view: new View({
        center: fromLonLat([0, 0]),
        zoom: 2,
      }),
    });
  }

  private createWmsLayer(): TileLayer<TileWMS> {
    return new TileLayer({
      properties: { id: 'wms-layer' },
      source: new TileWMS({
        url: this.config.wmsUrl,
        params: this.buildWmsParams(),
        transition: 0,
      }),
    });
  }

  private updateWmsLayer(): void {
    if (!this.map) {
      return;
    }

    if (!this.wmsLayer) {
      if (this.config.layerName && this.config.wmsUrl) {
        this.wmsLayer = this.createWmsLayer();
        this.map.addLayer(this.wmsLayer);
      }
      return;
    }

    if (!this.config.layerName || !this.config.wmsUrl) {
      this.map.removeLayer(this.wmsLayer);
      this.wmsLayer = undefined;
      return;
    }

    const source = this.wmsLayer.getSource();
    if (!source) {
      return;
    }

    source.setUrl(this.config.wmsUrl);
    source.updateParams(this.buildWmsParams());
    source.refresh();
  }

  private buildWmsParams(): Record<string, string | boolean> {
    return {
      LAYERS: this.config.layerName,
      FORMAT: this.config.format,
      TRANSPARENT: this.config.transparent,
      TILED: true,
      STYLES: '',
    };
  }
}
