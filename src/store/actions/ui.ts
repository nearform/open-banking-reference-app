const TOGGLE_SIDEBAR = 'TOGGLE_SIDEBAR'

export function toggleSidebar() {
  return {
    type: TOGGLE_SIDEBAR
  } as const
}

export type UIAction = ReturnType<typeof toggleSidebar>
