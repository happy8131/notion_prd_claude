import { z } from 'zod'

// --------------------------------------------
// 로그인 폼 스키마
// --------------------------------------------
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, '이메일을 입력해 주세요')
    .email('올바른 이메일 형식이 아닙니다'),
  password: z
    .string()
    .min(1, '비밀번호를 입력해 주세요')
    .min(8, '비밀번호는 최소 8자 이상이어야 합니다'),
})

export type LoginFormValues = z.infer<typeof loginSchema>

// --------------------------------------------
// 회원가입 폼 스키마
// --------------------------------------------
export const signupSchema = z
  .object({
    name: z
      .string()
      .min(1, '이름을 입력해 주세요')
      .max(50, '이름은 50자 이내로 입력해 주세요'),
    email: z
      .string()
      .min(1, '이메일을 입력해 주세요')
      .email('올바른 이메일 형식이 아닙니다'),
    password: z
      .string()
      .min(8, '비밀번호는 최소 8자 이상이어야 합니다')
      .regex(
        /^(?=.*[a-zA-Z])(?=.*\d)/,
        '비밀번호는 영문자와 숫자를 포함해야 합니다'
      ),
    confirmPassword: z.string().min(1, '비밀번호 확인을 입력해 주세요'),
    role: z.enum(['SALES', 'CLIENT'], {
      error: '역할을 선택해 주세요',
    }),
    /** 클라이언트 역할 선택 시 필수 입력 */
    customerName: z.string().optional(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['confirmPassword'],
  })
  .refine(
    data => {
      // 클라이언트 역할이면 고객명 필수
      if (data.role === 'CLIENT') {
        return data.customerName && data.customerName.trim().length > 0
      }
      return true
    },
    {
      message: '클라이언트 역할은 고객명을 입력해야 합니다',
      path: ['customerName'],
    }
  )

export type SignupFormValues = z.infer<typeof signupSchema>
