import type { CustomArticle } from "../type";

// 文章管理状态
export interface ArticleManagementState {
  // 文章列表
  articles: CustomArticle[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
  
  // 加载状态
  isLoading: boolean;
  isSaving: boolean;
  isDeleting: boolean;
  
  // 错误状态
  error: string | null;
  lastUpdated: number | null;
  
  // 搜索和过滤
  searchTerm: string;
  filter: {
    isOfficial?: boolean;
  };
  sortBy: 'createdAt' | 'lastPracticedAt' | 'title';
  sortOrder: 'asc' | 'desc';
  
  // 选择状态
  selectedArticles: number[];
  isSelectMode: boolean;
}

// 文章管理Action类型
export enum ArticleManagementActionType {
  // 加载状态
  SET_LOADING = 'SET_LOADING',
  SET_SAVING = 'SET_SAVING',
  SET_DELETING = 'SET_DELETING',
  
  // 文章列表
  SET_ARTICLES = 'SET_ARTICLES',
  ADD_ARTICLES = 'ADD_ARTICLES',
  UPDATE_ARTICLE = 'UPDATE_ARTICLE',
  REMOVE_ARTICLE = 'REMOVE_ARTICLE',
  REMOVE_ARTICLES = 'REMOVE_ARTICLES',
  
  // 分页
  SET_PAGE = 'SET_PAGE',
  SET_PAGE_SIZE = 'SET_PAGE_SIZE',
  SET_HAS_MORE = 'SET_HAS_MORE',
  
  // 错误处理
  SET_ERROR = 'SET_ERROR',
  CLEAR_ERROR = 'CLEAR_ERROR',
  
  // 搜索和过滤
  SET_SEARCH_TERM = 'SET_SEARCH_TERM',
  SET_FILTER = 'SET_FILTER',
  SET_SORT = 'SET_SORT',
  
  // 选择状态
  SET_SELECTED_ARTICLES = 'SET_SELECTED_ARTICLES',
  TOGGLE_ARTICLE_SELECTION = 'TOGGLE_ARTICLE_SELECTION',
  CLEAR_SELECTION = 'CLEAR_SELECTION',
  SET_SELECT_MODE = 'SET_SELECT_MODE',
  
  // 重置
  RESET = 'RESET'
}

// 文章管理Action
export type ArticleManagementAction =
  | { type: ArticleManagementActionType.SET_LOADING; payload: boolean }
  | { type: ArticleManagementActionType.SET_SAVING; payload: boolean }
  | { type: ArticleManagementActionType.SET_DELETING; payload: boolean }
  | { type: ArticleManagementActionType.SET_ARTICLES; payload: { articles: CustomArticle[]; total: number; hasMore: boolean } }
  | { type: ArticleManagementActionType.ADD_ARTICLES; payload: CustomArticle[] }
  | { type: ArticleManagementActionType.UPDATE_ARTICLE; payload: CustomArticle }
  | { type: ArticleManagementActionType.REMOVE_ARTICLE; payload: number }
  | { type: ArticleManagementActionType.REMOVE_ARTICLES; payload: number[] }
  | { type: ArticleManagementActionType.SET_PAGE; payload: number }
  | { type: ArticleManagementActionType.SET_PAGE_SIZE; payload: number }
  | { type: ArticleManagementActionType.SET_HAS_MORE; payload: boolean }
  | { type: ArticleManagementActionType.SET_ERROR; payload: string | null }
  | { type: ArticleManagementActionType.CLEAR_ERROR }
  | { type: ArticleManagementActionType.SET_SEARCH_TERM; payload: string }
  | { type: ArticleManagementActionType.SET_FILTER; payload: { isOfficial?: boolean } }
  | { type: ArticleManagementActionType.SET_SORT; payload: { sortBy: 'createdAt' | 'lastPracticedAt' | 'title'; sortOrder: 'asc' | 'desc' } }
  | { type: ArticleManagementActionType.SET_SELECTED_ARTICLES; payload: number[] }
  | { type: ArticleManagementActionType.TOGGLE_ARTICLE_SELECTION; payload: number }
  | { type: ArticleManagementActionType.CLEAR_SELECTION }
  | { type: ArticleManagementActionType.SET_SELECT_MODE; payload: boolean }
  | { type: ArticleManagementActionType.RESET };

// 初始状态
export const initialArticleManagementState: ArticleManagementState = {
  articles: [],
  total: 0,
  page: 1,
  pageSize: 20,
  hasMore: false,
  isLoading: false,
  isSaving: false,
  isDeleting: false,
  error: null,
  lastUpdated: null,
  searchTerm: '',
  filter: {},
  sortBy: 'lastPracticedAt',
  sortOrder: 'desc',
  selectedArticles: [],
  isSelectMode: false
};

// 文章管理Reducer
export function articleManagementReducer(
  state: ArticleManagementState,
  action: ArticleManagementAction
): ArticleManagementState {
  switch (action.type) {
    case ArticleManagementActionType.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
        error: action.payload ? null : state.error
      };

    case ArticleManagementActionType.SET_SAVING:
      return {
        ...state,
        isSaving: action.payload
      };

    case ArticleManagementActionType.SET_DELETING:
      return {
        ...state,
        isDeleting: action.payload
      };

    case ArticleManagementActionType.SET_ARTICLES:
      return {
        ...state,
        articles: action.payload.articles,
        total: action.payload.total,
        hasMore: action.payload.hasMore,
        lastUpdated: Date.now(),
        error: null
      };

    case ArticleManagementActionType.ADD_ARTICLES:
      return {
        ...state,
        articles: [...state.articles, ...action.payload],
        lastUpdated: Date.now()
      };

    case ArticleManagementActionType.UPDATE_ARTICLE:
      return {
        ...state,
        articles: state.articles.map(article =>
          article.id === action.payload.id ? action.payload : article
        ),
        lastUpdated: Date.now()
      };

    case ArticleManagementActionType.REMOVE_ARTICLE:
      return {
        ...state,
        articles: state.articles.filter(article => article.id !== action.payload),
        total: Math.max(0, state.total - 1),
        selectedArticles: state.selectedArticles.filter(id => id !== action.payload),
        lastUpdated: Date.now()
      };

    case ArticleManagementActionType.REMOVE_ARTICLES:
      return {
        ...state,
        articles: state.articles.filter(article => !action.payload.includes(article.id!)),
        total: Math.max(0, state.total - action.payload.length),
        selectedArticles: state.selectedArticles.filter(id => !action.payload.includes(id)),
        lastUpdated: Date.now()
      };

    case ArticleManagementActionType.SET_PAGE:
      return {
        ...state,
        page: action.payload
      };

    case ArticleManagementActionType.SET_PAGE_SIZE:
      return {
        ...state,
        pageSize: action.payload,
        page: 1 // 重置到第一页
      };

    case ArticleManagementActionType.SET_HAS_MORE:
      return {
        ...state,
        hasMore: action.payload
      };

    case ArticleManagementActionType.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
        isSaving: false,
        isDeleting: false
      };

    case ArticleManagementActionType.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    case ArticleManagementActionType.SET_SEARCH_TERM:
      return {
        ...state,
        searchTerm: action.payload,
        page: 1 // 重置到第一页
      };

    case ArticleManagementActionType.SET_FILTER:
      return {
        ...state,
        filter: action.payload,
        page: 1 // 重置到第一页
      };

    case ArticleManagementActionType.SET_SORT:
      return {
        ...state,
        sortBy: action.payload.sortBy,
        sortOrder: action.payload.sortOrder,
        page: 1 // 重置到第一页
      };

    case ArticleManagementActionType.SET_SELECTED_ARTICLES:
      return {
        ...state,
        selectedArticles: action.payload,
        isSelectMode: action.payload.length > 0
      };

    case ArticleManagementActionType.TOGGLE_ARTICLE_SELECTION:
      const articleId = action.payload;
      const isSelected = state.selectedArticles.includes(articleId);
      
      return {
        ...state,
        selectedArticles: isSelected
          ? state.selectedArticles.filter(id => id !== articleId)
          : [...state.selectedArticles, articleId],
        isSelectMode: isSelected
          ? state.selectedArticles.length > 1
          : true
      };

    case ArticleManagementActionType.CLEAR_SELECTION:
      return {
        ...state,
        selectedArticles: [],
        isSelectMode: false
      };

    case ArticleManagementActionType.SET_SELECT_MODE:
      return {
        ...state,
        isSelectMode: action.payload,
        selectedArticles: action.payload ? state.selectedArticles : []
      };

    case ArticleManagementActionType.RESET:
      return initialArticleManagementState;

    default:
      return state;
  }
}

// 选择器函数
export const articleManagementSelectors = {
  // 获取所有文章
  getAllArticles: (state: ArticleManagementState) => state.articles,
  
  // 获取自定义文章
  getCustomArticles: (state: ArticleManagementState) => 
    state.articles.filter(article => !article.isOfficial),
  
  // 获取官方文章
  getOfficialArticles: (state: ArticleManagementState) => 
    state.articles.filter(article => article.isOfficial),
  
  // 获取过滤后的文章
  getFilteredArticles: (state: ArticleManagementState) => {
    let articles = state.articles;
    
    // 应用搜索过滤
    if (state.searchTerm) {
      const searchTerm = state.searchTerm.toLowerCase();
      articles = articles.filter(article =>
        article.title.toLowerCase().includes(searchTerm) ||
        article.content.toLowerCase().includes(searchTerm)
      );
    }
    
    // 应用类型过滤
    if (state.filter.isOfficial !== undefined) {
      articles = articles.filter(article => article.isOfficial === state.filter.isOfficial);
    }
    
    return articles;
  },
  
  // 获取排序后的文章
  getSortedArticles: (state: ArticleManagementState) => {
    const articles = articleManagementSelectors.getFilteredArticles(state);
    
    return articles.sort((a, b) => {
      let aValue: any;
      let bValue: any;
      
      switch (state.sortBy) {
        case 'createdAt':
          aValue = a.createdAt;
          bValue = b.createdAt;
          break;
        case 'lastPracticedAt':
          aValue = a.lastPracticedAt || a.createdAt;
          bValue = b.lastPracticedAt || b.createdAt;
          break;
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        default:
          return 0;
      }
      
      if (state.sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  },
  
  // 获取选中的文章
  getSelectedArticles: (state: ArticleManagementState) =>
    state.articles.filter(article => state.selectedArticles.includes(article.id!)),
  
  // 获取加载状态
  getLoadingState: (state: ArticleManagementState) => ({
    isLoading: state.isLoading,
    isSaving: state.isSaving,
    isDeleting: state.isDeleting
  }),
  
  // 获取错误状态
  getErrorState: (state: ArticleManagementState) => ({
    error: state.error,
    hasError: !!state.error
  }),
  
  // 获取分页信息
  getPaginationInfo: (state: ArticleManagementState) => ({
    page: state.page,
    pageSize: state.pageSize,
    total: state.total,
    hasMore: state.hasMore,
    totalPages: Math.ceil(state.total / state.pageSize)
  }),
  
  // 获取选择状态
  getSelectionState: (state: ArticleManagementState) => ({
    selectedArticles: state.selectedArticles,
    isSelectMode: state.isSelectMode,
    selectedCount: state.selectedArticles.length,
    isAllSelected: state.articles.length > 0 && 
                   state.selectedArticles.length === state.articles.length,
    isPartiallySelected: state.selectedArticles.length > 0 && 
                        state.selectedArticles.length < state.articles.length
  }),
  
  // 获取统计信息
  getStats: (state: ArticleManagementState) => {
    const articles = state.articles;
    const total = articles.length;
    const custom = articles.filter(a => !a.isOfficial).length;
    const official = articles.filter(a => a.isOfficial).length;
    
    const totalWords = articles.reduce((sum, article) => {
      return sum + article.content.split(/\s+/).length;
    }, 0);
    
    const averageLength = total > 0 ? Math.round(totalWords / total) : 0;
    
    return {
      total,
      custom,
      official,
      totalWords,
      averageLength
    };
  }
};