import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, startWith } from 'rxjs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { MapEngine, MapLayerConfig } from '../../../../core/models/map-layer-config';
import { OpenlayersMapComponent } from '../../components/openlayers-map/openlayers-map.component';
import { CesiumMapComponent } from '../../components/cesium-map/cesium-map.component';

const WMS_FORMATS = [
  'image/png',
  'image/jpeg',
  'image/webp'
] as const;

@Component({
  selector: 'app-map-viewer',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatCardModule,
    OpenlayersMapComponent,
    CesiumMapComponent
  ],
  templateUrl: './map-viewer.component.html',
  styleUrl: './map-viewer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapViewerComponent {
  private static readonly DEFAULT_CONFIG: MapLayerConfig = {
    wmsUrl: 'http://localhost:8080/geoserver/wms',
    layerName: '',
    format: 'image/png',
    transparent: true
  };

  protected readonly engineOptions: { label: string; value: MapEngine }[] = [
    { label: 'OpenLayers', value: 'openlayers' },
    { label: 'Cesium', value: 'cesium' }
  ];

  protected readonly formatOptions = WMS_FORMATS;

  protected readonly mapForm = this.fb.nonNullable.group({
    wmsUrl: [MapViewerComponent.DEFAULT_CONFIG.wmsUrl, [Validators.required]],
    layerName: [MapViewerComponent.DEFAULT_CONFIG.layerName, [Validators.required]],
    format: [MapViewerComponent.DEFAULT_CONFIG.format, [Validators.required]],
    transparent: [MapViewerComponent.DEFAULT_CONFIG.transparent]
  });

  protected readonly selectedEngine = signal<MapEngine>('openlayers');

  private readonly formConfigStream = this.mapForm.valueChanges.pipe(
    startWith(this.mapForm.getRawValue()),
    map(formValue => ({
      wmsUrl: formValue.wmsUrl?.trim() ?? '',
      layerName: formValue.layerName?.trim() ?? '',
      format: formValue.format ?? MapViewerComponent.DEFAULT_CONFIG.format,
      transparent: formValue.transparent ?? MapViewerComponent.DEFAULT_CONFIG.transparent
    }))
  );

  protected readonly layerConfig = toSignal(this.formConfigStream, {
    initialValue: MapViewerComponent.DEFAULT_CONFIG
  });

  protected readonly canRenderMap = computed(
    () => this.layerConfig().wmsUrl.length > 0 && this.layerConfig().layerName.length > 0
  );

  constructor(private readonly fb: FormBuilder) {}

  protected onEngineChange(engine: MapEngine): void {
    this.selectedEngine.set(engine);
  }
}
