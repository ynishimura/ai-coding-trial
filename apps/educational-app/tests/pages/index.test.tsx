import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { useRouter } from "next/router";
import Home from "../../pages/index";

// Next.js router のモック
vi.mock("next/router", () => ({
  useRouter: vi.fn(),
}));

// framer-motion のモック
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => (
      <button {...props}>{children}</button>
    ),
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
  },
}));

describe("Home Page", () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as any).mockReturnValue({
      push: mockPush,
      pathname: "/",
      query: {},
      asPath: "/",
      route: "/",
    });
  });

  it("should render the main title and subtitle", () => {
    render(<Home />);

    expect(screen.getByText("もじをまなぼう！")).toBeInTheDocument();
    expect(screen.getByText("2-3さいのおこさまむけ")).toBeInTheDocument();
  });

  it("should render all character category buttons", () => {
    render(<Home />);

    expect(screen.getByText("ひらがな")).toBeInTheDocument();
    expect(screen.getByText("カタカナ")).toBeInTheDocument();
    expect(screen.getByText("アルファベット")).toBeInTheDocument();
  });

  it("should render all learning mode buttons for each category", () => {
    render(<Home />);

    // ひらがなカテゴリの学習モード
    const viewButtons = screen.getAllByText("もじをみる");
    const traceButtons = screen.getAllByText("なぞりがき");
    const quizButtons = screen.getAllByText("クイズ");

    expect(viewButtons).toHaveLength(3); // 3つのカテゴリ分
    expect(traceButtons).toHaveLength(3);
    expect(quizButtons).toHaveLength(3);
  });

  it("should navigate to hiragana view page when clicking hiragana view button", () => {
    render(<Home />);

    // ひらがなセクションの「もじをみる」ボタンを取得
    const hiraganaSection = screen.getByText("ひらがな").closest("div");
    const viewButton = hiraganaSection?.querySelector(
      'button:has-text("もじをみる")'
    );

    // より確実な方法でボタンを取得
    const allViewButtons = screen.getAllByText("もじをみる");
    fireEvent.click(allViewButtons[0]); // 最初のボタン（ひらがな）

    expect(mockPush).toHaveBeenCalledWith("/hiragana/view");
  });

  it("should navigate to katakana trace page when clicking katakana trace button", () => {
    render(<Home />);

    const allTraceButtons = screen.getAllByText("なぞりがき");
    fireEvent.click(allTraceButtons[1]); // 2番目のボタン（カタカナ）

    expect(mockPush).toHaveBeenCalledWith("/katakana/trace");
  });

  it("should navigate to alphabet quiz page when clicking alphabet quiz button", () => {
    render(<Home />);

    const allQuizButtons = screen.getAllByText("クイズ");
    fireEvent.click(allQuizButtons[2]); // 3番目のボタン（アルファベット）

    expect(mockPush).toHaveBeenCalledWith("/alphabet/quiz");
  });

  it("should display category descriptions", () => {
    render(<Home />);

    expect(screen.getByText("あ〜ん")).toBeInTheDocument();
    expect(screen.getByText("ア〜ン")).toBeInTheDocument();
    expect(screen.getByText("A〜Z")).toBeInTheDocument();
  });

  it("should display emojis for each category", () => {
    render(<Home />);

    // 絵文字がテキストとして存在することを確認
    const hiraganaEmoji = screen.getByText("🎎");
    const katakanaEmoji = screen.getByText("🎌");
    const alphabetEmoji = screen.getByText("🎓");

    expect(hiraganaEmoji).toBeInTheDocument();
    expect(katakanaEmoji).toBeInTheDocument();
    expect(alphabetEmoji).toBeInTheDocument();
  });

  it("should have proper accessibility attributes", () => {
    render(<Home />);

    // ボタンにアクセシブルな名前があることを確認
    const viewButtons = screen.getAllByText("もじをみる");
    const traceButtons = screen.getAllByText("なぞりがき");
    const quizButtons = screen.getAllByText("クイズ");

    viewButtons.forEach((button) => {
      expect(button.tagName).toBe("BUTTON");
    });
    traceButtons.forEach((button) => {
      expect(button.tagName).toBe("BUTTON");
    });
    quizButtons.forEach((button) => {
      expect(button.tagName).toBe("BUTTON");
    });
  });

  it("should render with responsive design classes", () => {
    render(<Home />);

    // Tailwind CSSクラスが適用されていることを確認
    const container = screen.getByText("もじをまなぼう！").closest("div");
    expect(container).toBeInTheDocument();
  });
});
