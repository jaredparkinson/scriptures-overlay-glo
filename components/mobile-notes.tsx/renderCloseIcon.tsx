import { appSettings } from '../SettingsComponent';
export function renderCloseIcon() {
  if (appSettings.settings.notesMode !== 'off') {
    return (
      <svg
        width="32px"
        height="32px"
        viewBox="0 0 20 20"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          d="M9.646 6.646a.5.5 0 01.708 0l6 6a.5.5 0 01-.708.708L10 7.707l-5.646 5.647a.5.5 0 01-.708-.708l6-6z"
          clip-rule="evenodd"
        />
      </svg>
    );
  }
  return (
    <svg
      width="32px"
      height="32px"
      viewBox="0 0 20 20"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        d="M3.646 6.646a.5.5 0 01.708 0L10 12.293l5.646-5.647a.5.5 0 01.708.708l-6 6a.5.5 0 01-.708 0l-6-6a.5.5 0 010-.708z"
        clip-rule="evenodd"
      />
    </svg>
  );
}
