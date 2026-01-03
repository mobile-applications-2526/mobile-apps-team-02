import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { scale, verticalScale, moderateScale } from "../../utils/scaling";

export default function CommentContent({ navigation,comments,commentsLoading, }) {
    return (
        <View style={styles.commentsSection}>
            {(() => {
                console.log('Rendering comments section. commentsLoading:', commentsLoading, 'comments.length:', comments.length);
                console.log('Comments state:', JSON.stringify(comments, null, 2));
                return null;
            })()}
            {commentsLoading ? (
                <ActivityIndicator size="small" color="#7CC57E" />
            ) : comments.length === 0 ? (
                <Text style={styles.noCommentsText}>No comments yet. Be the first to comment!</Text>
            ) : (
                comments.map((comment) => (
                    <View key={comment.id} style={styles.commentItem}>
                        <View style={styles.commentHeader}>
                            {/* Avatar */}
                            <TouchableOpacity
                                onPress={() => navigation.navigate('Profile', { userId: comment.user?.id })}
                                style={styles.commentAvatar}
                            >
                                {comment.user?.avatar_url ? (
                                    <Image
                                        source={{ uri: comment.user.avatar_url }}
                                        style={styles.avatarImage}
                                    />
                                ) : (
                                    <Ionicons name="person-circle" size={moderateScale(40)} color="#ccc" />
                                )}
                            </TouchableOpacity>

                            {/* Username */}
                            <TouchableOpacity
                                onPress={() => navigation.navigate('Profile', { userId: comment.user?.id })}
                                style={styles.commentInfo}
                            >
                                <Text style={styles.commentUsername}>
                                    {comment.user?.username || 'Anonymous'}
                                </Text>
                                <Text style={styles.commentDate}>
                                    {new Date(comment.created_at).toLocaleDateString()}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.commentContent}>{comment.content}</Text>
                    </View>
                ))
            )}


        </View>
    )
}

const styles = StyleSheet.create({
    commentsSection: {
        paddingHorizontal: scale(16),
        paddingTop: verticalScale(16),
    },
    noCommentsText: {
        fontSize: moderateScale(16),
        color: '#999',
        textAlign: 'center',
        paddingVertical: verticalScale(40),
    },
    commentItem: {
        marginBottom: verticalScale(16),
        paddingBottom: verticalScale(16),
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    commentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: verticalScale(8),
    },
    commentAvatar: {
        width: moderateScale(40),
        height: moderateScale(40),
        borderRadius: moderateScale(20),
        overflow: 'hidden',
        marginRight: scale(12),
    },

    avatarImage: {
        width: '100%',
        height: '100%',
    },
    commentInfo: {
        flex: 1,
    },
    commentUsername: {
        fontSize: moderateScale(16),
        fontWeight: '600',
        color: '#333',
    },
    commentDate: {
        fontSize: moderateScale(12),
        color: '#999',
        marginTop: verticalScale(2),
    },
    commentContent: {
        fontSize: moderateScale(15),
        color: '#333',
        lineHeight: moderateScale(22),
        marginLeft: moderateScale(52),
    },
})