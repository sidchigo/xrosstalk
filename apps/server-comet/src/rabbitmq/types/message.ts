export type ChatMessage = {
	type: 'chat';
	content: string;
	from: string;
	to: string;
	timestamp: number;
};
