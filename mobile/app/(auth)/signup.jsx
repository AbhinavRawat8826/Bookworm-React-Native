import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity, ActivityIndicator,
  Platform,
  Alert,
} from "react-native";
import styles from "../../assets/styles/login.styles";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";
import { useState } from "react";
import { Link, router, useRouter } from "expo-router";
import { useAuthStore } from "../../store/authStore";


export default function Signup() {
  const [username, setUsername] = useState("");
  const[email,setEmail]=useState('')
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
 

  const router = useRouter()
 const {user,isLoading,register}= useAuthStore()

  const handleSignup=async()=>{
     const result = await register(username,email,password)
     if (!result.success) {
      alert(`Signup Error: ${result.error}`);
    } else {
      alert('Welcome to BookWorm! 📚\nSignup successful!');
    }}
    
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>BookWorm 📚</Text>
            <Text style={styles.subtitle}>Share your favorite reads </Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Username</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={COLORS.primary}
                  style={styles.inputIcon}
                />

                <TextInput
                  style={styles.input}
                  placeholder="Enter your username"
                  placeholderTextColor={COLORS.placeholderText}
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="mail-outline"
                size={20}
                color={COLORS.primary}
                style={styles.inputIcon}
              />

              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor={COLORS.placeholderText}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>

            <View style={styles.inputContainer}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={COLORS.primary}
                style={styles.inputIcon}
              />

              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor={COLORS.placeholderText}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />

              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color={COLORS.primary}
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
          style={styles.button} 
          onPress={handleSignup}
          disabled={isLoading}

          >
            {isLoading? (
              <ActivityIndicator color='#fff'/>
            ):(
               <Text style={styles.buttonText}>SignUp</Text>
            )}

          </TouchableOpacity>


          <View style={styles.footer}>

            <Text style={styles.footerText}>Already have an account?</Text>
            

              <TouchableOpacity onPress={()=> router.back()}>
                <Text style={styles.link}>Login</Text>
              </TouchableOpacity>
            

          </View>
          </View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
