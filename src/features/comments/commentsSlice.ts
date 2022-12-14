import {
	createSlice,
	createEntityAdapter,
	createAsyncThunk,
	PayloadAction,
	createSelector,
} from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { schema } from 'normalizr';

// API
import api from '../../api';

// Boards
import { boardsFetchById } from '../boards/boardsSlice';

// Interfaces
import {
	CommentInterface,
	CommentCreateInterface,
	CommentDeleteInterface,
} from './commentsSlice.types';

// Entity
const commentsEntity = new schema.Entity('comments');

// Adapter
const commentsAdapter = createEntityAdapter<any>();

// Redux Slice for Comments
const commentsSlice = createSlice({
	name: 'comments',
	initialState: commentsAdapter.getInitialState(),
	reducers: {},
	extraReducers(builder) {
		builder
			.addCase(
				commentsCreate.fulfilled,
				(state, action: PayloadAction<any>) => {
					commentsAdapter.addOne(state, action.payload);
				}
			)
			.addCase(
				commentsDelete.fulfilled,
				(state, action: PayloadAction<any>) => {
					commentsAdapter.removeOne(state, action.payload.id);
				}
			)
			.addCase(
				boardsFetchById.fulfilled,
				(state, action: PayloadAction<any>) => {
					if (action.payload.comments)
						commentsAdapter.upsertMany(state, action.payload.comments);
					return state;
				}
			);
	},
});

// Thunks
// Create
const commentsCreate = createAsyncThunk(
	'comments/CREATE',
	async (payload: CommentCreateInterface) =>
		await api
			.post<CommentInterface>('/comment', {
				cardId: payload.cardId,
				message: payload.message,
			})
			.then((response) => response.data)
);

// Delete
const commentsDelete = createAsyncThunk(
	'comments/DELETE',
	async (payload: CommentDeleteInterface) =>
		await api.delete<string>(`/comment/${payload.id}`).then((response) => ({
			id: payload.id,
			cardId: payload.cardId,
			data: response.data,
		}))
);

// Export Actions
// const {} = commentsSlice.actions;

// Exports
export { commentsEntity, commentsCreate, commentsDelete };

// Export selector
export const commentsSelector = (state: RootState) => state.comments;

export const {
	selectAll: selectCommentsAll,
	selectTotal: selectCommentsTotal,
	selectById: selectCommentsById,
	selectIds: selectCommentsIds,
	selectEntities: selectCommentsEntities,
} = commentsAdapter.getSelectors((state: RootState) => state.comments);

// Export boardsSlice Reducer as Default
export default commentsSlice.reducer;
