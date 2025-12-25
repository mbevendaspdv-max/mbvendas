import { supabase, User, UserPlan } from './supabase'
import bcrypt from 'bcryptjs'

export interface AuthResponse {
  success: boolean
  message: string
  user?: User
  token?: string
}

// Registrar novo usuário
export async function registerUser(
  email: string,
  password: string,
  name: string,
  planType: UserPlan = 'free'
): Promise<AuthResponse> {
  try {
    // Verificar se email já existe
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (existingUser) {
      return {
        success: false,
        message: 'Email já cadastrado'
      }
    }

    // Hash da senha
    const passwordHash = await bcrypt.hash(password, 10)

    // Criar usuário
    const { data: newUser, error } = await supabase
      .from('users')
      .insert({
        email,
        password_hash: passwordHash,
        name,
        plan_type: planType
      })
      .select()
      .single()

    if (error) throw error

    // Criar sessão
    const token = generateToken()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30) // 30 dias

    await supabase
      .from('user_sessions')
      .insert({
        user_id: newUser.id,
        token,
        expires_at: expiresAt.toISOString()
      })

    return {
      success: true,
      message: 'Usuário criado com sucesso',
      user: newUser,
      token
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Erro ao criar usuário'
    }
  }
}

// Login de usuário
export async function loginUser(
  email: string,
  password: string
): Promise<AuthResponse> {
  try {
    // Buscar usuário
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (error || !user) {
      return {
        success: false,
        message: 'Email ou senha incorretos'
      }
    }

    // Verificar senha
    const passwordMatch = await bcrypt.compare(password, user.password_hash)

    if (!passwordMatch) {
      return {
        success: false,
        message: 'Email ou senha incorretos'
      }
    }

    // Criar nova sessão
    const token = generateToken()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30)

    await supabase
      .from('user_sessions')
      .insert({
        user_id: user.id,
        token,
        expires_at: expiresAt.toISOString()
      })

    // Remover password_hash antes de retornar
    const { password_hash, ...userWithoutPassword } = user

    return {
      success: true,
      message: 'Login realizado com sucesso',
      user: userWithoutPassword as User,
      token
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Erro ao fazer login'
    }
  }
}

// Verificar sessão
export async function verifySession(token: string): Promise<User | null> {
  try {
    const { data: session } = await supabase
      .from('user_sessions')
      .select('*, users(*)')
      .eq('token', token)
      .single()

    if (!session) return null

    // Verificar se sessão expirou
    if (new Date(session.expires_at) < new Date()) {
      await supabase
        .from('user_sessions')
        .delete()
        .eq('token', token)
      return null
    }

    const { password_hash, ...userWithoutPassword } = session.users
    return userWithoutPassword as User
  } catch (error) {
    return null
  }
}

// Logout
export async function logoutUser(token: string): Promise<boolean> {
  try {
    await supabase
      .from('user_sessions')
      .delete()
      .eq('token', token)
    return true
  } catch (error) {
    return false
  }
}

// Verificar limite de usuários do plano
export async function checkPlanUserLimit(planType: UserPlan): Promise<{ allowed: boolean; current: number; max: number }> {
  try {
    // Buscar informações do plano
    const { data: plan } = await supabase
      .from('plans')
      .select('*')
      .eq('name', planType)
      .single()

    if (!plan) {
      return { allowed: false, current: 0, max: 0 }
    }

    // Contar usuários ativos no plano
    const { count } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('plan_type', planType)

    const currentUsers = count || 0
    const allowed = currentUsers < plan.max_users

    return {
      allowed,
      current: currentUsers,
      max: plan.max_users
    }
  } catch (error) {
    return { allowed: false, current: 0, max: 0 }
  }
}

// Gerar token aleatório
function generateToken(): string {
  return Array.from({ length: 32 }, () =>
    Math.random().toString(36).charAt(2)
  ).join('')
}
