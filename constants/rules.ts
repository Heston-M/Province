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
    title: "The Basics",
    sections: [
      {
        type: "text",
        content: "The goal is to capture territory tiles. Select tiles on the board to capture them."
      },
      {
        type: "image",
        image: {
          source: require("@/assets/gameImages/boards/blankBoard4x4.png"),
          caption: "A blank board of territory tiles",
        }
      },
      {
        type: "text",
        content: "Each time you capture a territory tile, it costs you 1 resource."
      },
      {
        type: "image",
        image: {
          source: require("@/assets/gameImages/menu/resourcesLeft8Light.png"),
          darkThemeSource: require("@/assets/gameImages/menu/resourcesLeft8Dark.png"),
          width: 150,
          height: 50,
        }
      },
      {
        type: "text",
        content: "Your resources are limited. If you run out of moves before you can capture the whole board, you lose."
      },
    ]
  },
  {
    id: 2,
    title: "Territory Growth",
    sections: [
      {
        type: "text",
        content: "Territory tiles start brown when you capture them and turn green as you are making other moves."
      },
      {
        type: "image",
        image: {
          source: require("@/assets/gameImages/gifs/territoryGrowth.gif"),
          caption: "A territory tile growing over time"
        }
      },
    ]
  },
  {
    id: 3,
    title: "Harvesting Territory",
    sections: [
      {
        type: "text",
        content: "When territory is green, you can harvest it to gain back resources. This will drain the tile and all your adjacent territories."
      },
      {
        type: "image",
        image: {
          source: require("@/assets/gameImages/gifs/territoryHarvesting.gif"),
          caption: "Territory tiles being harvested"
        }
      },
      {
        type: "text",
        content: "You get 1 resource back for each territory tile you harvest, including those adjacent ones. Though, you can only hold so many resources at a time."
      },
      {
        type: "text",
        content: "Harvesting territory tiles will not advance the enemy nor your other Territory tiles. So you're safe to harvest as much land at once as you think is helpful."
      }
    ]
  },
  {
    id: 4,
    title: "Fortified Territory",
    sections: [
      {
        type: "text",
        content: "Fortified territory tiles are protected against attacks. The enemy cannot capture them, no matter hard they try to."
      },
      {
        type: "image",
        image: {
          source: require("@/assets/gameImages/tiles/fortified.png"),
          caption: "Fortified territory tile"
        }
      },
      {
        type: "text",
        content: "To fortify a territory tile, simply leave it alone. A green territory tile will automatically become fortified."
      },
      {
        type: "image",
        image: {
          source: require("@/assets/gameImages/gifs/territoryFortification.gif"),
          caption: "Territories become fortified over time"
        }
      },
    ]
  },
  {
    id: 5,
    title: "The Enemy",
    sections: [
      {
        type: "text",
        content: "The enemy are here to do the same as you, conquer. They will capture nearby territory tiles as well as your own tiles if they get the chance."
      },
      {
        type: "image",
        image: {
          source: require("@/assets/gameImages/tiles/enemy.png"),
          caption: "Enemy territory tile",
        }
      },
      {
        type: "text",
        content: "You must defeat all enemies.",
      },
      {
        type: "text",
        content: "Capturing an enemy tile costs 1 extra resource, unless a fortified tile of yours is adjacent to it.",
      }
    ]
  },
  {
    id: 6,
    title: "Fog of War",
    sections: [
      {
        type: "text",
        content: "Often, the battlefield is obscured by fog. You can only see (and capture) the tiles that are adjacent to your captured tiles."
      },
      {
        type: "image",
        image: {
          source: require("@/assets/gameImages/gifs/fogOfWarRevealing.gif"),
          caption: "Fog of War",
        }
      }
    ]
  },
  {
    id: 7,
    title: "Time Limit",
    sections: [
      {
        type: "text",
        content: "In some battles, you have a limited amount of time to capture the battlefield. If you don't capture the whole board before the time limit runs out, you lose."
      },
      {
        type: "text",
        content: "When there is no time limit, the timer will count up from 0, in case you care about winning as fast as possible."
      },
      {
        type: "text",
        content: "I just care that you win. So win."
      }
    ]
  },
  {
    id: 8,
    title: "Now go.",
    sections: [
      {
        type: "text",
        content: "While I don't have much faith in you, maybe you'll surprise me."
      },
      {
        type: "text",
        content: "But I'm not holding my breath."
      },
    ]
  }
];

export const getRulesPage = (pageId: number): RulesPage => {
  return rulesPages.find(page => page.id === pageId) ?? defaultRulesPage;
};

export const getTotalPages = (): number => {
  return rulesPages.length;
};