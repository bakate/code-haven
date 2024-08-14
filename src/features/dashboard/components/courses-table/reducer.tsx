import { StateType } from "../../types";


export type CourseTableAction =
  | { type: 'SET_FILTER_VALUE'; payload: string }
  | { type: 'SET_SELECTED_KEYS'; payload: Set<string> }
  | { type: 'SET_STATUS_FILTER'; payload: string }
  | { type: 'SET_VISIBLE_COLUMNS'; payload: Set<string> }
  | { type: 'SET_ROWS_PER_PAGE'; payload: number }
  | { type: 'SET_SORT_DESCRIPTOR'; payload: StateType['sortDescriptor'] }
  | { type: 'SET_PAGE'; payload: number };


export const initialCourseTableState: StateType = {
  filterValue: "",
  selectedKeys: new Set([]),
  statusFilter: "all",
  visibleColumns: new Set(["titles", "categoryId", "price", "isPublished", "actions"]),
  rowsPerPage: 5,
  sortDescriptor: {
    column: "titles",
    direction: "ascending",
  },
  page: 1,
};


export function coursesTableReducer(state: StateType, action: CourseTableAction): StateType {
  switch (action.type) {
    case 'SET_FILTER_VALUE':
      return { ...state, filterValue: action.payload, page: 1 };
    case 'SET_SELECTED_KEYS':
      return { ...state, selectedKeys: action.payload };
    case 'SET_STATUS_FILTER':
      return { ...state, statusFilter: action.payload };
    case 'SET_VISIBLE_COLUMNS':
      return { ...state, visibleColumns: action.payload };
    case 'SET_ROWS_PER_PAGE':
      return { ...state, rowsPerPage: action.payload, page: 1 };
    case 'SET_SORT_DESCRIPTOR':
      return { ...state, sortDescriptor: action.payload };
    case 'SET_PAGE':
      return { ...state, page: action.payload };
    default:
      return state;
  }
}
