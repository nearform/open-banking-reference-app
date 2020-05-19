import React, { useState, useRef, MutableRefObject } from 'react'
import { compose, connect, AppState, Dispatch } from 'store'
import { View, StyleSheet, FlatList, TextInput } from 'react-native'
import { withTranslation, WithTranslation } from 'react-i18next'
import { differenceInDays } from 'date-fns'

import { sendMessage as sendMessageAction } from 'store/actions/assistant'

import Message from 'components/molecules/message'
import Icon from 'components/atoms/icon'
import DaySeparator from 'components/atoms/day-separator'
import Subheader from 'components/organisms/subheader'

import { colors } from 'constants/colors'

type MapStateToProps = ReturnType<typeof mapStateToProps>
type MapDispatchToProps = ReturnType<typeof mapDispatchToProps>

interface Props extends WithTranslation, MapStateToProps, MapDispatchToProps {}

export const Messages: React.FC<Props> = ({ messages, sendMessage, t }) => {
  const [text, setText] = useState<string>()
  const inputRef = useRef() as MutableRefObject<TextInput>
  const flatListRef = useRef() as MutableRefObject<FlatList>

  const renderMessage = ({ item, index }: { item: MapStateToProps['messages'][0]; index: number }) => {
    const prevMessage = messages[index - 1]

    const prevDate = prevMessage ? prevMessage.date : item.date
    const dayDiff = differenceInDays(new Date(prevDate), new Date(item.date))

    const isDateIndicatorVisible = !prevMessage || dayDiff < 0
    const isAvatarVisible = !prevMessage || item.isBot !== prevMessage.isBot

    return (
      <View>
        {isDateIndicatorVisible && <DaySeparator date={item.date} />}
        <Message {...item} isAvatarVisible={isAvatarVisible} />
      </View>
    )
  }

  const onTextSubmitted = () => {
    if (text && text.trim()) {
      sendMessage(text)
      setText('')
      inputRef.current.setNativeProps({ text: '' })
    }
  }

  return (
    <View style={styles.view}>
      <Subheader title={t('messages:title')} hideBackButton />
      <View style={styles.messages}>
        {messages && (
          <FlatList
            data={messages}
            ref={flatListRef}
            renderItem={renderMessage}
            onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
            onLayout={() => flatListRef.current.scrollToEnd({ animated: true })}
            keyExtractor={(_, index) => index.toString()}
            extraData={messages}
          />
        )}
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder={'Ask Assistant a question'}
          ref={inputRef}
          placeholderTextColor="rgb(155, 161, 161)"
          style={styles.textInput}
          onChangeText={setText}
          onSubmitEditing={onTextSubmitted}
          blurOnSubmit={false}
        />
        <View style={styles.icon}>
          <Icon name="question-mark" width="24" height="24" />
        </View>
      </View>
    </View>
  )
}

const mapStateToProps = (state: AppState) => ({
  awaitingResponse: state.assistant.awaitingResponse,
  messages: state.assistant.messages
})

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  sendMessage: (text: string) => dispatch(sendMessageAction(text))
})

export default compose(
  connect<MapStateToProps, MapDispatchToProps>(mapStateToProps, mapDispatchToProps),
  withTranslation()
)(Messages)

const styles = StyleSheet.create({
  view: {
    backgroundColor: colors.white,
    flex: 1,
    width: '100%',
    alignItems: 'center'
  },
  messages: {
    flex: 1,
    padding: 12,
    paddingTop: 0,
    paddingBottom: 0,
    width: '100%'
  },
  inputContainer: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    height: 110,
    width: '100%',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.VERY_LIGHT_GREY,
    paddingVertical: 24,
    paddingHorizontal: 12
  },
  textInput: {
    padding: 18,
    backgroundColor: colors.VERY_LIGHT_GREY,
    opacity: 0.6,
    height: '100%',
    borderRadius: 2,
    fontFamily: 'fira-sans',
    fontSize: 16,
    fontStyle: 'italic',
    borderWidth: 0
  },
  icon: {
    backgroundColor: colors.VERY_LIGHT_GREY,
    position: 'absolute',
    right: 32
  }
})
