import "@/global.css";
import { router } from "expo-router";
import { View } from "react-native";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { Input, InputField, InputSlot, InputIcon } from "@/components/ui/input";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { ScrollView } from "@/components/ui/scroll-view";
import { Card } from "@/components/ui/card";
import {
  AddIcon,
  AlertCircleIcon,
  BellIcon,
  CheckIcon,
  ChevronRightIcon,
  SearchIcon,
  EyeIcon,
  EyeOffIcon,
  AtSignIcon,
  LockIcon,
  MailIcon,
  FavouriteIcon,
  StarIcon,
  ShareIcon
} from "@/components/ui/icon";

// Custom Components
import TextButton from "@/components/inputs/text-button";
import IconButton from "@/components/inputs/icon-button";
import CustomTextInput from "@/components/inputs/text-input";
import Navbar from "@/components/navigation/navbar/tabbar";
import CustomTabBar from "@/components/navigation/tabbar";
import PageLayout from "@/components/layouts/page-layout";

export default function UIDemo() {
  return (
    <PageLayout title="Component Demo" backButtonHidden className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 py-8">
          <VStack space="2xl" className="items-center mb-8">
            <Heading size="2xl" className="text-gray-900 text-center">
              Component Demo
            </Heading>
            <Text size="lg" className="text-gray-600 text-center">
              Explore different button and input variants
            </Text>
          </VStack>

          {/* Custom Components Section */}
          <VStack space="lg" className="mb-12">
            <Heading size="xl" className="text-gray-900 mb-4">Custom Components</Heading>

            {/* Custom Text Buttons */}
            <Card className="p-6">
              <Text className="text-lg font-semibold text-gray-800 mb-4">Custom Text Buttons</Text>
              <VStack space="md">
                <TextButton
                  label="Primary Custom Button"
                  variant="primary"
                  size="md"
                  onPress={() => console.log("Primary pressed")}
                />
                <TextButton
                  label="Secondary Custom Button"
                  variant="secondary"
                  size="md"
                  onPress={() => console.log("Secondary pressed")}
                />
                <TextButton
                  label="Outline Custom Button"
                  variant="outline"
                  size="md"
                  onPress={() => console.log("Outline pressed")}
                />
                <TextButton
                  label="Link Custom Button"
                  variant="link"
                  size="md"
                  onPress={() => console.log("Link pressed")}
                />
                <TextButton
                  label="Transparent Custom Button"
                  variant="transparent"
                  size="md"
                  onPress={() => console.log("Transparent pressed")}
                />
              </VStack>
            </Card>

            {/* Custom Text Button Sizes */}
            <Card className="p-6">
              <Text className="text-lg font-semibold text-gray-800 mb-4">Custom Text Button Sizes</Text>
              <VStack space="md">
                <TextButton
                  label="Small Custom Button"
                  variant="primary"
                  size="sm"
                  onPress={() => console.log("Small pressed")}
                />
                <TextButton
                  label="Medium Custom Button"
                  variant="primary"
                  size="md"
                  onPress={() => console.log("Medium pressed")}
                />
                <TextButton
                  label="Large Custom Button"
                  variant="primary"
                  size="lg"
                  onPress={() => console.log("Large pressed")}
                />
                <TextButton
                  label="Extra Large Custom Button"
                  variant="primary"
                  size="xl"
                  onPress={() => console.log("XL pressed")}
                />
              </VStack>
            </Card>

            {/* Custom Icon Buttons */}
            <Card className="p-6">
              <Text className="text-lg font-semibold text-gray-800 mb-4">Custom Icon Buttons</Text>
              <VStack space="md">
                <HStack space="md" className="flex-wrap">
                  <IconButton
                    iconName="home"
                    variant="primary"
                    onPress={() => console.log("Home pressed")}
                  />
                  <IconButton
                    iconName="heart"
                    variant="secondary"
                    onPress={() => console.log("Heart pressed")}
                  />
                  <IconButton
                    iconName="star"
                    variant="outline"
                    onPress={() => console.log("Star pressed")}
                  />
                  <IconButton
                    iconName="settings"
                    variant="link"
                    onPress={() => console.log("Settings pressed")}
                  />
                </HStack>
              </VStack>
            </Card>

            {/* Custom Icon Buttons with Labels */}
            <Card className="p-6">
              <Text className="text-lg font-semibold text-gray-800 mb-4">Custom Icon Buttons with Labels</Text>
              <VStack space="md">
                <IconButton
                  iconName="home"
                  label="Home"
                  variant="primary"
                  onPress={() => console.log("Home with label pressed")}
                />
                <IconButton
                  iconName="person"
                  label="Profile"
                  variant="secondary"
                  onPress={() => console.log("Profile pressed")}
                />
                <IconButton
                  iconName="mail"
                  label="Messages"
                  variant="outline"
                  onPress={() => console.log("Messages pressed")}
                />
                <IconButton
                  iconName="notifications"
                  label="Notifications"
                  variant="link"
                  onPress={() => console.log("Notifications pressed")}
                />
              </VStack>
            </Card>

            {/* Custom Text Inputs */}
            <Card className="p-6">
              <Text className="text-lg font-semibold text-gray-800 mb-4">Custom Text Inputs</Text>
              <VStack space="md">
                <CustomTextInput
                  label="Small Input"
                  size="sm"
                  placeholder="Enter small text"
                />
                <CustomTextInput
                  label="Medium Input"
                  size="md"
                  placeholder="Enter medium text"
                />
                <CustomTextInput
                  label="Large Input"
                  size="lg"
                  placeholder="Enter large text"
                />
              </VStack>
            </Card>

            {/* Custom Text Inputs with Icons */}
            <Card className="p-6">
              <Text className="text-lg font-semibold text-gray-800 mb-4">Custom Text Inputs with Icons</Text>
              <VStack space="md">
                <CustomTextInput
                  label="Email"
                  size="md"
                  iconName="mail"
                  placeholder="Enter your email"
                />
                <CustomTextInput
                  label="Password"
                  size="md"
                  iconName="lock-closed"
                  placeholder="Enter your password"
                  secureTextEntry
                />
                <CustomTextInput
                  label="Search"
                  size="md"
                  iconName="search"
                  placeholder="Search something"
                />
                <CustomTextInput
                  label="Phone"
                  size="md"
                  iconName="call"
                  placeholder="Enter phone number"
                  keyboardType="phone-pad"
                />
              </VStack>
            </Card>

            {/* Custom Input States */}
            <Card className="p-6">
              <Text className="text-lg font-semibold text-gray-800 mb-4">Custom Input States</Text>
              <VStack space="md">
                <CustomTextInput
                  label="Normal State"
                  size="md"
                  placeholder="Normal input"
                />
                <CustomTextInput
                  label="Invalid State"
                  size="md"
                  placeholder="Invalid input"
                  isInvalid
                  helperText="This field has an error"
                />
                <CustomTextInput
                  label="Unsaved State"
                  size="md"
                  placeholder="Unsaved input"
                  isUnsaved
                  helperText="This field has unsaved changes"
                />
              </VStack>
            </Card>

            {/* Navigation Components Preview */}
            <Card className="p-6">
              <Text className="text-lg font-semibold text-gray-800 mb-4">Navigation Components Preview</Text>
              <VStack space="md">
                <Text className="text-md font-medium text-gray-700 mb-2">Custom Navbar</Text>
                <View className="border border-gray-200 rounded-lg overflow-hidden">
                  <Navbar
                    title="Demo Page"
                    backButtonHidden={false}
                  />
                </View>

                <Text className="text-md font-medium text-gray-700 mb-2 mt-4">Custom Tab Bar Preview</Text>
                <View className="border border-gray-200 rounded-lg overflow-hidden">
                  <CustomTabBar
                    state={{
                      index: 0,
                      routes: [
                        { key: 1, name: "Home" },
                        { key: 2, name: "Messages" },
                        { key: 3, name: "Profile" }
                      ]
                    }}
                    descriptors={{
                      1: { options: { title: "Home" } },
                      2: { options: { title: "Messages" } },
                      3: { options: { title: "Profile" } }
                    }}
                    navigation={{
                      navigate: (name: string) => console.log(`Navigate to ${name}`)
                    }}
                  />
                </View>
              </VStack>
            </Card>
          </VStack>

          {/* Text Buttons Section */}
          <VStack space="lg" className="mb-12">
            <Heading size="xl" className="text-gray-900 mb-4">Text Buttons</Heading>

            {/* Button Actions */}
            <Card className="p-6">
              <Text className="text-lg font-semibold text-gray-800 mb-4">Button Actions</Text>
              <VStack space="md">
                <HStack space="md" className="flex-wrap">
                  <Button action="primary" size="md">
                    <ButtonText>Primary</ButtonText>
                  </Button>
                  <Button action="secondary" size="md">
                    <ButtonText>Secondary</ButtonText>
                  </Button>
                  <Button action="positive" size="md">
                    <ButtonText>Positive</ButtonText>
                  </Button>
                  <Button action="negative" size="md">
                    <ButtonText>Negative</ButtonText>
                  </Button>
                </HStack>
              </VStack>
            </Card>

            {/* Button Variants */}
            <Card className="p-6">
              <Text className="text-lg font-semibold text-gray-800 mb-4">Button Variants</Text>
              <VStack space="md">
                <HStack space="md" className="flex-wrap">
                  <Button variant="solid" action="primary" size="md">
                    <ButtonText>Solid</ButtonText>
                  </Button>
                  <Button variant="outline" action="primary" size="md">
                    <ButtonText>Outline</ButtonText>
                  </Button>
                  <Button variant="link" action="primary" size="md">
                    <ButtonText>Link</ButtonText>
                  </Button>
                </HStack>
              </VStack>
            </Card>

            {/* Button Sizes */}
            <Card className="p-6">
              <Text className="text-lg font-semibold text-gray-800 mb-4">Button Sizes</Text>
              <VStack space="md">
                <Button action="primary" size="xs">
                  <ButtonText>Extra Small</ButtonText>
                </Button>
                <Button action="primary" size="sm">
                  <ButtonText>Small</ButtonText>
                </Button>
                <Button action="primary" size="md">
                  <ButtonText>Medium</ButtonText>
                </Button>
                <Button action="primary" size="lg">
                  <ButtonText>Large</ButtonText>
                </Button>
                <Button action="primary" size="xl">
                  <ButtonText>Extra Large</ButtonText>
                </Button>
              </VStack>
            </Card>
          </VStack>

          {/* Icon Buttons Section */}
          <VStack space="lg" className="mb-12">
            <Heading size="xl" className="text-gray-900 mb-4">Icon Buttons</Heading>

            {/* Icon Only Buttons */}
            <Card className="p-6">
              <Text className="text-lg font-semibold text-gray-800 mb-4">Icon Only Buttons</Text>
              <HStack space="md" className="flex-wrap">
                <Button action="primary" size="md" className="w-12 h-12">
                  <ButtonIcon as={AddIcon} />
                </Button>
                <Button action="secondary" size="md" className="w-12 h-12">
                  <ButtonIcon as={BellIcon} />
                </Button>
                <Button action="positive" size="md" className="w-12 h-12">
                  <ButtonIcon as={CheckIcon} />
                </Button>
                <Button action="negative" size="md" className="w-12 h-12">
                  <ButtonIcon as={AlertCircleIcon} />
                </Button>
              </HStack>
            </Card>

            {/* Icon + Text Buttons */}
            <Card className="p-6">
              <Text className="text-lg font-semibold text-gray-800 mb-4">Icon + Text Buttons</Text>
              <VStack space="md">
                <Button action="primary" size="md">
                  <ButtonIcon as={AddIcon} />
                  <ButtonText>Add Item</ButtonText>
                </Button>
                <Button action="secondary" size="md">
                  <ButtonIcon as={BellIcon} />
                  <ButtonText>Notifications</ButtonText>
                </Button>
                <Button action="positive" size="md">
                  <ButtonIcon as={CheckIcon} />
                  <ButtonText>Confirm</ButtonText>
                </Button>
                <Button action="negative" size="md">
                  <ButtonIcon as={AlertCircleIcon} />
                  <ButtonText>Alert</ButtonText>
                </Button>
              </VStack>
            </Card>

            {/* Text + Icon Buttons */}
            <Card className="p-6">
              <Text className="text-lg font-semibold text-gray-800 mb-4">Text + Icon Buttons</Text>
              <VStack space="md">
                <Button action="primary" size="md">
                  <ButtonText>Continue</ButtonText>
                  <ButtonIcon as={ChevronRightIcon} />
                </Button>
                <Button action="secondary" size="md">
                  <ButtonText>Share</ButtonText>
                  <ButtonIcon as={ShareIcon} />
                </Button>
                <Button action="positive" size="md">
                  <ButtonText>Favorite</ButtonText>
                  <ButtonIcon as={FavouriteIcon} />
                </Button>
                <Button action="negative" size="md">
                  <ButtonText>Rate</ButtonText>
                  <ButtonIcon as={StarIcon} />
                </Button>
              </VStack>
            </Card>

            {/* Icon Button Variants */}
            <Card className="p-6">
              <Text className="text-lg font-semibold text-gray-800 mb-4">Icon Button Variants</Text>
              <HStack space="md" className="flex-wrap">
                <Button variant="solid" action="primary" size="md">
                  <ButtonIcon as={AddIcon} />
                  <ButtonText>Solid</ButtonText>
                </Button>
                <Button variant="outline" action="primary" size="md">
                  <ButtonIcon as={AddIcon} />
                  <ButtonText>Outline</ButtonText>
                </Button>
                <Button variant="link" action="primary" size="md">
                  <ButtonIcon as={AddIcon} />
                  <ButtonText>Link</ButtonText>
                </Button>
              </HStack>
            </Card>
          </VStack>

          {/* Text Inputs Section */}
          <VStack space="lg" className="mb-12">
            <Heading size="xl" className="text-gray-900 mb-4">Text Inputs</Heading>

            {/* Input Variants */}
            <Card className="p-6">
              <Text className="text-lg font-semibold text-gray-800 mb-4">Input Variants</Text>
              <VStack space="md">
                <Input variant="outline" size="md">
                  <InputField placeholder="Outline Input" />
                </Input>
                <Input variant="underlined" size="md">
                  <InputField placeholder="Underlined Input" />
                </Input>
                <Input variant="rounded" size="md">
                  <InputField placeholder="Rounded Input" />
                </Input>
              </VStack>
            </Card>

            {/* Input Sizes */}
            <Card className="p-6">
              <Text className="text-lg font-semibold text-gray-800 mb-4">Input Sizes</Text>
              <VStack space="md">
                <Input variant="outline" size="sm">
                  <InputField placeholder="Small Input" />
                </Input>
                <Input variant="outline" size="md">
                  <InputField placeholder="Medium Input" />
                </Input>
                <Input variant="outline" size="lg">
                  <InputField placeholder="Large Input" />
                </Input>
                <Input variant="outline" size="xl">
                  <InputField placeholder="Extra Large Input" />
                </Input>
              </VStack>
            </Card>

            {/* Input with Icons */}
            <Card className="p-6">
              <Text className="text-lg font-semibold text-gray-800 mb-4">Input with Icons</Text>
              <VStack space="md">
                <Input variant="outline" size="md">
                  <InputSlot className="pl-3">
                    <InputIcon as={SearchIcon} />
                  </InputSlot>
                  <InputField placeholder="Search..." />
                </Input>

                <Input variant="outline" size="md">
                  <InputSlot className="pl-3">
                    <InputIcon as={AtSignIcon} />
                  </InputSlot>
                  <InputField placeholder="Email address" />
                </Input>

                <Input variant="outline" size="md">
                  <InputSlot className="pl-3">
                    <InputIcon as={LockIcon} />
                  </InputSlot>
                  <InputField placeholder="Password" secureTextEntry />
                  <InputSlot className="pr-3">
                    <InputIcon as={EyeIcon} />
                  </InputSlot>
                </Input>

                <Input variant="outline" size="md">
                  <InputSlot className="pl-3">
                    <InputIcon as={MailIcon} />
                  </InputSlot>
                  <InputField placeholder="Username" />
                </Input>
              </VStack>
            </Card>

            {/* Different Input Types */}
            <Card className="p-6">
              <Text className="text-lg font-semibold text-gray-800 mb-4">Different Input Types</Text>
              <VStack space="md">
                <Input variant="outline" size="md">
                  <InputField placeholder="Text Input" />
                </Input>

                <Input variant="outline" size="md">
                  <InputField placeholder="Email Input" keyboardType="email-address" />
                </Input>

                <Input variant="outline" size="md">
                  <InputField placeholder="Number Input" keyboardType="numeric" />
                </Input>

                <Input variant="outline" size="md">
                  <InputField placeholder="Phone Input" keyboardType="phone-pad" />
                </Input>

                <Input variant="outline" size="md">
                  <InputField placeholder="Password Input" secureTextEntry />
                </Input>
              </VStack>
            </Card>

            {/* Input States */}
            <Card className="p-6">
              <Text className="text-lg font-semibold text-gray-800 mb-4">Input States</Text>
              <VStack space="md">
                <Input variant="outline" size="md">
                  <InputField placeholder="Normal State" />
                </Input>

                <Input variant="outline" size="md" isDisabled>
                  <InputField placeholder="Disabled State" />
                </Input>

                <Input variant="outline" size="md" isInvalid>
                  <InputField placeholder="Invalid State" />
                </Input>

                <Input variant="outline" size="md" isFocused>
                  <InputField placeholder="Focused State" value="Focused Input" />
                </Input>
              </VStack>
            </Card>
          </VStack>
        </View>
      </ScrollView>
    </PageLayout>
  );
}