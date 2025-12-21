import { ImageSourcePropType } from "react-native";

export type RulesImage = {
  source: ImageSourcePropType;
  darkThemeSource?: ImageSourcePropType;
  caption?: string;
  width?: number;
  height?: number;
};

export type RulesPage = {
  id: number;
  title: string;
  sections: Array<{
    type: "text" | "image" | "text-image";
    content?: string;
    image?: RulesImage;
  }>;
};

const defaultRulesPage: RulesPage = {
  id: 0,
  title: "Default Rules Page",
  sections: [
    {
      type: "text",
      content: "This is the default rules page. Please select a different page from the menu."
    }
  ]
};

// Temp ai generated rules pages
export const rulesPages: RulesPage[] = [
  {
    id: 1,
    title: "Getting Started",
    sections: [
      {
        type: "text",
        content: "Welcome to Province! The goal is to capture territory tiles..."
      },
      {
        type: "image",
        image: {
          source: require("@/assets/gameImages/brownTile.jpg"),
          caption: "A territory tile",
          width: 100,
          height: 100
        }
      },
      {
        type: "text",
        content: "Select tiles to capture them..."
      }
    ]
  },
  {
    id: 2,
    title: "Tile Types",
    sections: [
      {
        type: "text-image",
        content: "Territory tiles start brown and turn green over time.",
        image: {
          source: require("@/assets/gameImages/greenTile.jpg"),
          caption: "A mature territory tile"
        }
      },
      // More sections...
    ]
  },
  // More pages...
];

export const getRulesPage = (pageId: number): RulesPage => {
  return rulesPages.find(page => page.id === pageId) ?? defaultRulesPage;
};

export const getTotalPages = (): number => {
  return rulesPages.length;
};