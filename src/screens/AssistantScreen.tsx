import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  FlatList, StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useTranslation } from '../i18n/useTranslation';
import { ChatMessage } from '../types';
import { sendChatMessage } from '../services/chatService';
import { Colors } from '../theme/colors';

const GROQ_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY || '';

export function AssistantScreen() {
  const { t, lang } = useTranslation();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef<FlatList>(null);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const reply = await sendChatMessage(messages, text, GROQ_KEY);
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: reply,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const errMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: t.assistantError,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }

  function renderMessage({ item }: { item: ChatMessage }) {
    const isUser = item.role === 'user';
    return (
      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAssistant]}>
        <Text style={[styles.bubbleText, isUser ? styles.bubbleTextUser : styles.bubbleTextAssistant]}>
          {item.content}
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{t.assistantTitle}</Text>
        <Text style={styles.subtitle}>{t.assistantSubtitle}</Text>
      </View>

      {/* Message list */}
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
        ListEmptyComponent={
          <View style={styles.welcomeBox}>
            <Text style={styles.welcomeText}>{t.assistantWelcome}</Text>
          </View>
        }
        renderItem={renderMessage}
      />

      {/* Typing indicator */}
      {loading && (
        <View style={styles.typingBox}>
          <Text style={styles.typingText}>{t.assistantThinking}</Text>
        </View>
      )}

      {/* Disclaimer */}
      <Text style={styles.disclaimer}>{t.assistantDisclaimer}</Text>

      {/* Input bar */}
      <View style={styles.inputRow}>
        <TextInput
  style={styles.input}
  value={input}
  onChangeText={setInput}
  placeholder={t.assistantPlaceholder}
  placeholderTextColor={Colors.textLight}
  maxLength={500}
  returnKeyType="send"
  blurOnSubmit={false}
  onSubmitEditing={() => {
    if (input.trim()) send();
  }}
/>
        <TouchableOpacity
          style={[styles.sendBtn, (!input.trim() || loading) && styles.sendBtnDisabled]}
          onPress={send}
          disabled={!input.trim() || loading}
        >
          <Text style={styles.sendBtnText}>{t.assistantSend}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surface },
  header: {
    backgroundColor: Colors.white,
    padding: 20, paddingTop: 60,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  title: { fontSize: 22, fontWeight: '800', color: Colors.text, marginBottom: 2 },
  subtitle: { fontSize: 13, color: Colors.textMuted },
  messageList: { padding: 16, paddingBottom: 8 },
  welcomeBox: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 16, padding: 16, margin: 8,
  },
  welcomeText: { fontSize: 14, color: Colors.primary, lineHeight: 20 },
  bubble: {
    maxWidth: '82%', borderRadius: 16, padding: 12,
    marginBottom: 8,
  },
  bubbleUser: {
    backgroundColor: Colors.primary,
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  bubbleAssistant: {
    backgroundColor: Colors.white,
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
    borderWidth: 1, borderColor: Colors.border,
  },
  bubbleText: { fontSize: 14, lineHeight: 20 },
  bubbleTextUser: { color: Colors.white },
  bubbleTextAssistant: { color: Colors.text },
  typingBox: { paddingHorizontal: 20, paddingVertical: 6 },
  typingText: { fontSize: 13, color: Colors.textMuted, fontStyle: 'italic' },
  disclaimer: {
    fontSize: 11, color: Colors.textLight,
    textAlign: 'center', paddingHorizontal: 20, paddingBottom: 6,
  },
  inputRow: {
    flexDirection: 'row', padding: 12, gap: 8,
    backgroundColor: Colors.white,
    borderTopWidth: 1, borderTopColor: Colors.border,
  },
  input: {
    flex: 1, backgroundColor: Colors.surface,
    borderRadius: 20, paddingHorizontal: 14, paddingVertical: 10,
    fontSize: 14, color: Colors.text,
    maxHeight: 100,
    borderWidth: 1, borderColor: Colors.border,
  },
  sendBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 20, paddingHorizontal: 16,
    justifyContent: 'center',
  },
  sendBtnDisabled: { backgroundColor: Colors.textLight },
  sendBtnText: { color: Colors.white, fontWeight: '700', fontSize: 14 },
});