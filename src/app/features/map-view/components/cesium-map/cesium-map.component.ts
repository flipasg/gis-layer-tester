import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Viewer,
  WebMapServiceImageryProvider,
  ImageryLayer,
  OpenStreetMapImageryProvider
} from 'cesium';
import Compass from '@cesium-extends/compass';
import { MapLayerConfig } from '../../../../core/models/map-layer-config';

@Component({
  selector: 'app-cesium-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cesium-map.component.html',
  styleUrl: './cesium-map.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CesiumMapComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input({ required: true }) config!: MapLayerConfig;
  @ViewChild('cesiumContainer', { static: true }) private readonly cesiumContainer!: ElementRef<HTMLDivElement>;

  private viewer?: Viewer;
  private wmsLayer?: ImageryLayer;
  private compass?: Compass;

  ngAfterViewInit(): void {
    this.viewer = new Viewer(this.cesiumContainer.nativeElement, {
      imageryProvider: new OpenStreetMapImageryProvider({
        url: 'https://tile.openstreetmap.org/'
      }),
      animation: false,
      timeline: false,
      baseLayerPicker: false,
      geocoder: false,
      navigationHelpButton: false,
      fullscreenButton: false,
      homeButton: true,
      sceneModePicker: true
    });

    this.compass = new Compass(this.viewer);

    this.addOrUpdateWmsLayer();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config'] && !changes['config'].firstChange) {
      this.addOrUpdateWmsLayer();
    }
  }

  ngOnDestroy(): void {
    this.viewer?.destroy();
    this.viewer = undefined;
    this.wmsLayer = undefined;
    this.compass?.destroy();
    this.compass = undefined;
  }

  private addOrUpdateWmsLayer(): void {
    if (!this.viewer || !this.config.layerName || !this.config.wmsUrl) {
      return;
    }

    const imageryProvider = new WebMapServiceImageryProvider({
      url: this.config.wmsUrl,
      layers: this.config.layerName,
      parameters: {
        format: this.config.format,
        transparent: this.config.transparent,
        tiled: true
      }
    });

    if (this.wmsLayer) {
      this.viewer.imageryLayers.remove(this.wmsLayer, true);
    }

    this.wmsLayer = this.viewer.imageryLayers.addImageryProvider(imageryProvider);
  }
}
