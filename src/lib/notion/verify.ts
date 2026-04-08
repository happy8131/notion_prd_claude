/**
 * Notion API 연동 검증 스크립트
 *
 * 실행 방법:
 *   npx tsx src/lib/notion/verify.ts
 *
 * 검증 항목:
 *   1. 환경 변수 존재 여부
 *   2. Notion API 인증 성공 여부
 *   3. 견적서 데이터베이스 접근 가능 여부
 *   4. 데이터베이스 프로퍼티 구조 검증
 */

// 환경 변수 직접 로드 (dotenv 없이 process.env 사용)
// 이 스크립트는 Next.js 런타임 외부에서 실행되므로
// .env.local을 직접 읽어야 합니다
import { readFileSync } from 'fs'
import { resolve } from 'path'

// .env.local 파일 수동 파싱 (tsx 환경에서 dotenv 대체)
function loadEnvLocal() {
  try {
    const envPath = resolve(process.cwd(), '.env.local')
    const content = readFileSync(envPath, 'utf-8')

    content.split('\n').forEach(line => {
      // 주석과 빈 줄 제외
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) return

      const eqIndex = trimmed.indexOf('=')
      if (eqIndex === -1) return

      const key = trimmed.substring(0, eqIndex).trim()
      const value = trimmed.substring(eqIndex + 1).trim()

      // 이미 설정된 환경 변수는 덮어쓰지 않음
      if (!process.env[key]) {
        process.env[key] = value
      }
    })

    console.log('  .env.local 파일 로드 완료\n')
  } catch {
    console.warn('  경고: .env.local 파일을 찾을 수 없습니다.\n')
  }
}

// Notion 필수 프로퍼티 목록 (견적서 데이터베이스 스키마)
const REQUIRED_PROPERTIES = [
  { name: '견적서 번호', type: 'title' },
  { name: '고객명', type: 'rich_text' },
  { name: '고객 이메일', type: 'email' },
  { name: '총 금액', type: 'number' },
  { name: '통화', type: 'select' },
  { name: '상태', type: 'select' },
  { name: '작성일', type: 'date' },
  { name: '유효기간', type: 'date' },
] as const

// 상태 옵션 검증 목록
const REQUIRED_STATUS_OPTIONS = ['DRAFT', 'SENT', 'ACCEPTED', 'EXPIRED']
const REQUIRED_CURRENCY_OPTIONS = ['KRW', 'USD']

// 결과 출력 헬퍼 함수
function printSuccess(message: string) {
  console.log(`  [성공] ${message}`)
}

function printError(message: string) {
  console.error(`  [실패] ${message}`)
}

function printInfo(message: string) {
  console.log(`  [정보] ${message}`)
}

async function verifyNotionConnection() {
  console.log('==========================================')
  console.log('  Notion API 연동 검증 시작')
  console.log('==========================================\n')

  // Step 1: 환경 변수 파일 로드
  console.log('[Step 1] 환경 변수 파일 로드')
  loadEnvLocal()

  // Step 2: 환경 변수 존재 여부 확인
  console.log('[Step 2] 환경 변수 검증')

  const notionApiKey = process.env.NOTION_API_KEY
  const databaseId = process.env.NOTION_INVOICE_DATABASE_ID

  let hasError = false

  if (!notionApiKey) {
    printError('NOTION_API_KEY 가 설정되지 않았습니다.')
    printInfo('  → .env.local에 NOTION_API_KEY=ntn_xxx... 형식으로 입력하세요')
    hasError = true
  } else if (
    !notionApiKey.startsWith('ntn_') &&
    !notionApiKey.startsWith('secret_')
  ) {
    printError(
      'NOTION_API_KEY 형식이 올바르지 않습니다. "ntn_" 또는 "secret_"으로 시작해야 합니다.'
    )
    hasError = true
  } else {
    // API 키 마스킹 출력 (앞 10자 + ***)
    const maskedKey = notionApiKey.substring(0, 10) + '***'
    printSuccess(`NOTION_API_KEY 확인됨: ${maskedKey}`)
  }

  if (!databaseId) {
    printError('NOTION_INVOICE_DATABASE_ID 가 설정되지 않았습니다.')
    printInfo('  → Notion 데이터베이스 URL에서 32자리 ID를 추출하여 입력하세요')
    printInfo('  → URL 형식: https://notion.so/workspace/[32자리-ID]?v=xxx')
    hasError = true
  } else {
    // 하이픈 제거 후 32자리인지 확인
    const cleanId = databaseId.replace(/-/g, '')
    if (cleanId.length !== 32) {
      printError(
        `NOTION_INVOICE_DATABASE_ID 길이가 올바르지 않습니다. (현재: ${cleanId.length}자리, 필요: 32자리)`
      )
      hasError = true
    } else {
      printSuccess(`NOTION_INVOICE_DATABASE_ID 확인됨: ${databaseId}`)
    }
  }

  if (hasError) {
    console.log('\n[결과] 환경 변수 오류로 인해 검증을 중단합니다.')
    console.log(
      '  .env.local 파일을 확인하고 올바른 값을 입력한 후 다시 실행하세요.\n'
    )
    process.exit(1)
  }

  console.log()

  // Step 3: Notion 클라이언트 초기화 및 API 연결 테스트
  console.log('[Step 3] Notion API 연결 테스트')

  let notionClient: import('@notionhq/client').Client

  try {
    const { Client } = await import('@notionhq/client')
    notionClient = new Client({ auth: notionApiKey })
    printSuccess('Notion 클라이언트 초기화 완료')
  } catch (error) {
    printError('@notionhq/client 패키지를 로드할 수 없습니다.')
    printInfo('  → npm install 을 실행하여 패키지를 설치하세요')
    console.error('  상세 오류:', error)
    process.exit(1)
  }

  // 사용자 정보 조회로 인증 확인
  try {
    const botUser = await notionClient.users.me({})
    printSuccess(
      `API 인증 성공: ${botUser.name ?? '이름 없음'} (${botUser.type})`
    )
  } catch (error: unknown) {
    printError('Notion API 인증에 실패했습니다.')

    if (error && typeof error === 'object' && 'code' in error) {
      const notionError = error as { code: string; message?: string }
      if (notionError.code === 'unauthorized') {
        printInfo('  → NOTION_API_KEY가 올바르지 않거나 만료되었습니다.')
        printInfo(
          '  → https://www.notion.so/my-integrations 에서 토큰을 재확인하세요.'
        )
      } else {
        printInfo(`  → 오류 코드: ${notionError.code}`)
        printInfo(`  → 오류 메시지: ${notionError.message ?? '없음'}`)
      }
    }

    process.exit(1)
  }

  console.log()

  // Step 4: 데이터베이스 접근 및 구조 검증
  console.log('[Step 4] 견적서 데이터베이스 검증')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let database: any

  try {
    database = await notionClient.databases.retrieve({
      database_id: databaseId!,
    })
    const dbTitle =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((database as any).title as Array<{ plain_text: string }>)[0]
        ?.plain_text ?? '제목 없음'
    printSuccess(`데이터베이스 접근 성공: "${dbTitle}"`)
  } catch (error: unknown) {
    printError('데이터베이스에 접근할 수 없습니다.')

    if (error && typeof error === 'object' && 'code' in error) {
      const notionError = error as { code: string; message?: string }
      if (notionError.code === 'object_not_found') {
        printInfo(
          '  → 데이터베이스 ID가 올바르지 않거나 인테그레이션이 연결되지 않았습니다.'
        )
        printInfo(
          '  → Notion 데이터베이스 페이지 우측 상단 "..." → "연결" → 인테그레이션 선택'
        )
        printInfo('  → 또는 데이터베이스 URL에서 ID를 다시 확인하세요.')
      } else {
        printInfo(`  → 오류 코드: ${notionError.code}`)
      }
    }

    process.exit(1)
  }

  // Step 5: 데이터소스 ID 추출 (새 API 사용 필요)
  console.log('\n[Step 5] 데이터소스 ID 추출')

  let dataSourceId: string | null = null
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dataSources = (database as any).data_sources
    if (dataSources && dataSources.length > 0) {
      dataSourceId = dataSources[0].id
      printSuccess(`데이터소스 ID 확인: ${dataSourceId}`)
    } else {
      printError('데이터소스를 찾을 수 없습니다.')
      process.exit(1)
    }
  } catch (error) {
    printError('데이터소스 ID를 추출할 수 없습니다.')
    console.error('    ', error)
    process.exit(1)
  }

  console.log()

  // Step 6: 필수 프로퍼티 구조 검증 (데이터 조회를 통해 확인)
  console.log('[Step 6] 데이터베이스 프로퍼티 구조 검증')

  let propertyErrors = 0
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dbProperties: Record<string, any> = {}

  // 첫 페이지를 조회하여 프로퍼티 스키마를 추출
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sampleQuery = await (notionClient as any).dataSources.query({
      data_source_id: dataSourceId!,
      page_size: 1,
    })

    if (sampleQuery.results && sampleQuery.results.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const samplePage = sampleQuery.results[0] as any
      if (samplePage.properties) {
        // 프로퍼티 이름과 타입 추출
        printInfo('  → 실제 데이터베이스 필드:')
        Object.entries(samplePage.properties).forEach(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ([name, prop]: [string, any]) => {
            dbProperties[name] = { type: prop.type }
            printInfo(`    - ${name} (${prop.type})`)
            // Select/Status 프로퍼티의 경우 옵션도 포함
            if (
              (prop.type === 'select' || prop.type === 'status') &&
              (prop.select || prop.status)
            ) {
              dbProperties[name].select = prop.select || prop.status
            }
          }
        )
      }
    } else {
      printInfo(
        '  → 데이터베이스가 비어 있습니다. 기본 구조 검증만 수행합니다.'
      )
    }
  } catch (error) {
    printError('샘플 데이터 조회 중 오류가 발생했습니다.')
    console.error('    ', error)
  }

  // 필수 프로퍼티 검증
  for (const required of REQUIRED_PROPERTIES) {
    const prop = dbProperties[required.name]

    if (!prop) {
      printError(
        `프로퍼티 누락: "${required.name}" (${required.type} 타입 필요)`
      )
      propertyErrors++
    } else if (prop.type !== required.type) {
      printError(
        `프로퍼티 타입 불일치: "${required.name}" - 현재: ${prop.type}, 필요: ${required.type}`
      )
      propertyErrors++
    } else {
      printSuccess(`프로퍼티 확인: "${required.name}" (${required.type})`)
    }
  }

  // 상태(Status) Select 옵션 검증
  const statusProp = dbProperties['상태']
  if (statusProp?.type === 'select' && statusProp.select) {
    const options =
      statusProp.select.options?.map((o: { name: string }) => o.name) ?? []
    const missingOptions = REQUIRED_STATUS_OPTIONS.filter(
      opt => !options.includes(opt)
    )
    if (missingOptions.length > 0) {
      printError(`"상태" 프로퍼티 옵션 누락: ${missingOptions.join(', ')}`)
      printInfo(`  → 현재 옵션: ${options.join(', ')}`)
      propertyErrors++
    } else {
      printSuccess(`"상태" 옵션 확인: ${REQUIRED_STATUS_OPTIONS.join(', ')}`)
    }
  }

  // 통화(Currency) Select 옵션 검증
  const currencyProp = dbProperties['통화']
  if (currencyProp?.type === 'select' && currencyProp.select) {
    const options =
      currencyProp.select.options?.map((o: { name: string }) => o.name) ?? []
    const missingOptions = REQUIRED_CURRENCY_OPTIONS.filter(
      opt => !options.includes(opt)
    )
    if (missingOptions.length > 0) {
      printError(`"통화" 프로퍼티 옵션 누락: ${missingOptions.join(', ')}`)
      printInfo(`  → 현재 옵션: ${options.join(', ')}`)
      propertyErrors++
    } else {
      printSuccess(`"통화" 옵션 확인: ${REQUIRED_CURRENCY_OPTIONS.join(', ')}`)
    }
  }

  console.log()

  // Step 7: 샘플 데이터 조회 테스트
  console.log('[Step 7] 데이터 조회 테스트')

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const queryResult = await (notionClient as any).dataSources.query({
      data_source_id: dataSourceId!,
      page_size: 5,
    })

    printSuccess(
      `데이터 조회 성공: 총 ${queryResult.results.length}건 확인 (최대 5건 조회)`
    )

    if (queryResult.results.length === 0) {
      printInfo(
        '  → 데이터베이스가 비어 있습니다. 샘플 데이터 3건을 입력하세요.'
      )
    } else {
      // 각 레코드의 견적서 번호 출력
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      queryResult.results.forEach((page: any, index: number) => {
        if (page.object === 'page' && 'properties' in page) {
          const titleProp = page.properties['견적서 번호']
          let invoiceNum = '번호 없음'
          if (titleProp?.type === 'title' && titleProp.title.length > 0) {
            invoiceNum = titleProp.title[0].plain_text
          }
          printInfo(`  레코드 ${index + 1}: ${invoiceNum}`)
        }
      })
    }
  } catch (error: unknown) {
    printError('데이터 조회에 실패했습니다.')
    if (error && typeof error === 'object' && 'message' in error) {
      printInfo(`  → 오류: ${(error as { message: string }).message}`)
    }
    propertyErrors++
  }

  // 최종 결과 출력
  console.log('\n==========================================')

  if (propertyErrors === 0) {
    console.log('  [완료] 모든 검증을 통과했습니다!')
    console.log('  Notion API 연동이 정상적으로 설정되었습니다.')
  } else {
    console.log(`  [경고] ${propertyErrors}개 항목에서 문제가 발견되었습니다.`)
    console.log('  위의 오류 메시지를 확인하고 Notion 설정을 수정하세요.')
  }

  console.log('==========================================\n')

  if (propertyErrors > 0) {
    process.exit(1)
  }
}

// 스크립트 실행
verifyNotionConnection().catch(error => {
  console.error('\n예상치 못한 오류가 발생했습니다:', error)
  process.exit(1)
})
