import {
  NoteTypes,
  NoteCategories,
} from '../oith-lib/src/verse-notes/settings/note-gorup-settings';
import { flatMap } from 'rxjs/operators';
import { BehaviorSubject, of, forkJoin } from 'rxjs';
import axios from 'axios';
import { NoteSettings } from '../oith-lib/src/processors/NoteSettings';
import { Settings } from './Settings';
export class AppSettings {
  public settings: Settings;
  public noteSettings?: NoteSettings;
  public noteTypes?: NoteTypes;
  public displayNav$: BehaviorSubject<boolean>; //(false);
  public notesMode$: BehaviorSubject<string>;
  public noteCategories?: NoteCategories;
  constructor() {
    const settingsS = localStorage.getItem('scriptures-overlay-settings');
    this.settings = settingsS ? JSON.parse(settingsS) : new Settings();
    this.displayNav$ = new BehaviorSubject(this.settings.displayNav);
    this.notesMode$ = new BehaviorSubject(this.settings.notesMode);
    this.loadNoteSettings();
  }
  private async getNoteTypeSettings<T extends keyof AppSettings>(
    key: T,
    fileName: 'note-settings' | 'note-categories' | 'note-types',
  ) {
    if (!this[key]) {
      const lang = this.settings.lang;
      try {
        const data = await axios.get(
          `/scripture_files/${lang}-${fileName}.json`,
          {
            responseType: 'json',
          },
        );
        this[key] = data.data;
        this.save(key);
      } catch (error) {
        console.log(error);
      }
    }
  }
  public loadNoteSettings() {
    const noteSettingsS = localStorage.getItem(
      'scriptures-overlay-noteSettings',
    );
    const noteTypesS = localStorage.getItem('scriptures-overlay-noteTypes');
    const noteCategoriesS = localStorage.getItem(
      'scriptures-overlay-noteCategories',
    );
    this.noteSettings = noteSettingsS ? JSON.parse(noteSettingsS) : undefined;
    this.noteTypes = noteTypesS ? JSON.parse(noteTypesS) : undefined;
    this.noteCategories = noteCategoriesS
      ? JSON.parse(noteCategoriesS)
      : undefined;
    forkJoin(
      of(this.getNoteTypeSettings('noteSettings', 'note-settings')),
      of(this.getNoteTypeSettings('noteCategories', 'note-categories')),
      of(this.getNoteTypeSettings('noteTypes', 'note-types')),
    )
      .pipe(flatMap(o => o))
      .subscribe();
  }
  public displayNav() {
    this.settings.displayNav = !this.settings.displayNav;
    this.displayNav$.next(this.settings.displayNav);
    this.save('settings');
  }
  public displayNotes() {
    const displayNotes = this.settings.notesMode;
    if (displayNotes === 'off' || typeof displayNotes === 'undefined') {
      this.settings.notesMode = 'small';
    } else if (displayNotes === 'small') {
      this.settings.notesMode = 'large';
    } else {
      this.settings.notesMode = 'off';
    }
    this.save('settings');
    this.notesMode$.next(this.settings.notesMode);
  }
  public save<T extends keyof this>(key: T) {
    localStorage.setItem(
      `scriptures-overlay-${key}`,
      JSON.stringify(this[key]),
    );
  }
}