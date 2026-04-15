import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createComment,
  createNotification,
  deleteComment,
  listCommentsByIdea,
} from "@dataconnect/generated";
import { Avatar } from "@/components/Avatar";
import { queryKeys } from "@/services/queryKeys";
import { useAuth } from "@/hooks/useAuth";
import type { Comment } from "@/types/comment";
import { colors } from "@/constants/theme";

interface Props {
  ideaId: string;
  ideaAuthorId: string;
}

export function CommentSection({ ideaId, ideaAuthorId }: Props) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [text, setText] = useState("");
  const inputRef = useRef<TextInput>(null);

  const commentsQuery = useQuery({
    queryKey: queryKeys.comments.byIdea(ideaId),
    queryFn: async () => {
      const result = await listCommentsByIdea({ ideaId });
      return result.data.comments.map<Comment>(c => ({
        id: c.id,
        ideaId,
        content: c.content,
        authorId: c.author.id,
        authorDisplayName: c.author.displayName ?? null,
        authorAvatarUrl: c.author.avatarUrl ?? null,
        createdAt: c.createdAt,
      }));
    },
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      await createComment({ ideaId, content: text.trim() });
      if (ideaAuthorId && user && ideaAuthorId !== user.id) {
        await createNotification({
          recipientId: ideaAuthorId,
          type: "COMMENT_ADDED",
          targetId: ideaId,
          metaData: null,
        }).catch(() => {}); // notification failure is non-critical
      }
    },
    onSuccess: () => {
      setText("");
      inputRef.current?.blur();
      queryClient.invalidateQueries({ queryKey: queryKeys.comments.byIdea(ideaId) });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteComment({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.comments.byIdea(ideaId) });
    },
  });

  const confirmDelete = (id: string) =>
    Alert.alert("Xóa bình luận", "Xóa bình luận này?", [
      { text: "Hủy", style: "cancel" },
      { text: "Xóa", style: "destructive", onPress: () => deleteMutation.mutate(id) },
    ]);

  const comments = commentsQuery.data ?? [];

  return (
    <View className="mt-6">
      <Text className="text-lg font-lx-bold text-foreground mb-3">
        Bình luận ({comments.length})
      </Text>

      {commentsQuery.isLoading ? (
        <ActivityIndicator color={colors.primary} />
      ) : comments.length === 0 ? (
        <Text className="text-sm font-lx text-muted mb-4">Chưa có bình luận nào.</Text>
      ) : (
        comments.map(c => (
          <View key={c.id} className="flex-row gap-3 mb-4">
            <Avatar uri={c.authorAvatarUrl} name={c.authorDisplayName ?? c.authorId} size={32} />
            <View className="flex-1">
              <View className="flex-row justify-between items-start">
                <Text className="text-sm font-lx-semi text-foreground">
                  {c.authorDisplayName ?? c.authorId}
                </Text>
                {c.authorId === user?.id && (
                  <Pressable onPress={() => confirmDelete(c.id)} hitSlop={8}>
                    <Text className="text-xs font-lx text-muted">Xóa</Text>
                  </Pressable>
                )}
              </View>
              <Text className="text-sm font-lx text-foreground mt-0.5">{c.content}</Text>
              <Text className="text-xs font-lx text-muted mt-1">
                {new Date(c.createdAt).toLocaleString("vi-VN")}
              </Text>
            </View>
          </View>
        ))
      )}

      {/* Input gửi bình luận */}
      <View className="flex-row gap-2 items-end mt-2">
        <TextInput
          ref={inputRef}
          className="flex-1 border border-border rounded-xl px-3 py-3 text-sm font-lx text-foreground bg-surface"
          placeholder="Viết bình luận..."
          placeholderTextColor={colors.textSecondary}
          value={text}
          onChangeText={setText}
          multiline
        />
        <Pressable
          className={`bg-primary rounded-xl px-4 py-3 ${(!text.trim() || addMutation.isPending) ? "opacity-40" : ""}`}
          onPress={() => addMutation.mutate()}
          disabled={!text.trim() || addMutation.isPending}
        >
          <Text className="text-white text-sm font-lx-semi">Gửi</Text>
        </Pressable>
      </View>
    </View>
  );
}
