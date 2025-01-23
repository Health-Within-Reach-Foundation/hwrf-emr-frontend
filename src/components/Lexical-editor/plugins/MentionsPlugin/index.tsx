// import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
// import {
//   LexicalTypeaheadMenuPlugin,
//   MenuOption,
// } from "@lexical/react/LexicalTypeaheadMenuPlugin";
// import { TextNode } from "lexical";
// import { useCallback, useEffect, useMemo, useState } from "react";
// import * as React from "react";
// import * as ReactDOM from "react-dom";
// import axios from "axios";
// // import { useAuth } from "@/app/shared/auth-context/AuthContext";
// import { $createMentionNode } from "../../nodes/MentionNode";
// import "./index.css";
// // import { adjustMentionsMenuPosition } from "@/utils/adjust-mention-menu-position";

// // Constants
// const TRIGGER = "@";
// const PUNCTUATION =
//   "\\.,\\+\\*\\?\\$\\@\\|#{}\\(\\)\\^\\-\\[\\]\\\\/!%'\"~=<>_:;";
// const VALID_CHARS = `[^${TRIGGER}${PUNCTUATION}\\s]`;
// const LENGTH_LIMIT = 75;
// const SUGGESTION_LIST_LENGTH_LIMIT = 5;
// const MENTION_REGEX = new RegExp(`(?:^|\\s)${TRIGGER}(${VALID_CHARS}*)$`);

// // Mentions Cache to Avoid Redundant API Calls
// const mentionsCache = new Map();

// // Utility: Matches Mention Trigger and Query
// function checkForMentionMatch(text: string) {
//   const match = MENTION_REGEX.exec(text);
//   return match
//     ? {
//         leadOffset: match.index + 1,
//         matchingString: match[1],
//         replaceableString: TRIGGER + match[1],
//       }
//     : null;
// }

// // Custom Menu Option Class for Mentions
// class MentionTypeaheadOption extends MenuOption {
//   name: string;
//   constructor(name: string) {
//     super(name);
//     this.name = name;
//   }
// }

// // Component: Typeahead Menu Item
// function MentionsTypeaheadMenuItem({
//   index,
//   isSelected,
//   onClick,
//   onMouseEnter,
//   option,
// }: {
//   index: number;
//   isSelected: boolean;
//   onClick: () => void;
//   onMouseEnter: () => void;
//   option: MentionTypeaheadOption;
// }) {
//   const className = isSelected ? "item selected" : "item";
//   return (
//     <li
//       key={option.key}
//       tabIndex={-1}
//       className={className}
//       ref={option.setRefElement}
//       role="option"
//       aria-selected={isSelected}
//       onMouseEnter={onMouseEnter}
//       onClick={onClick}
//     >
//       <i className="icon user" />
//       <span className="text">{option.name}</span>
//     </li>
//   );
// }

// // Hook: Fetch Mentions Suggestions
// function useMentionLookupService(mentionString: string | null) {
//   const [results, setResults] = useState<string[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   // const auth = useAuth();
//   const fetchMentions = useCallback(
//     async (searchTerm: string) => {
//       setLoading(true);
//       try {
//         // Check cache first
//         if (mentionsCache.has(searchTerm)) {
//           setResults(mentionsCache.get(searchTerm));
//           return;
//         }

//         // Fetch users from API
//         const response = await axios.get(
//           `${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/pg/get-users`,
//           auth?.config
//         );
//         const users: string[] = response.data.data.map(
//           (user: any) => user.name
//         );

//         // Filter matching users
//         const matchedUsers = users.filter((user) =>
//           user.toLowerCase().includes(searchTerm.toLowerCase())
//         );

//         // Update cache and state
//         mentionsCache.set(searchTerm, matchedUsers);
//         setResults(matchedUsers);
//       } catch (error) {
//         console.error("Error fetching mentions:", error);
//         setResults([]);
//       } finally {
//         setLoading(false);
//       }
//     },
//     [auth]
//   );

//   useEffect(() => {
//     if (mentionString !== null) {
//       fetchMentions(mentionString);
//     } else {
//       setResults([]);
//     }
//   }, [mentionString, fetchMentions]);

//   return { results, loading };
// }

// // Main Component
// export default function NewMentionsPlugin(): JSX.Element | null {
//   const [editor] = useLexicalComposerContext();
//   const [queryString, setQueryString] = useState<string | null>(null);

//   const { results, loading } = useMentionLookupService(queryString);

//   const options = useMemo(
//     () =>
//       results
//         .map((result) => new MentionTypeaheadOption(result))
//         .slice(0, SUGGESTION_LIST_LENGTH_LIMIT),
//     [results]
//   );

//   const onSelectOption = useCallback(
//     (
//       selectedOption: MentionTypeaheadOption,
//       nodeToReplace: TextNode | null,
//       closeMenu: () => void
//     ) => {
//       editor.update(() => {
//         const mentionNode = $createMentionNode(selectedOption.name);
//         if (nodeToReplace) {
//           nodeToReplace.replace(mentionNode);
//         }
//         mentionNode.select();
//         closeMenu();
//       });
//     },
//     [editor]
//   );

//   const triggerFn = useCallback(
//     (text: string) => checkForMentionMatch(text),
//     []
//   );

//   return (
//     <LexicalTypeaheadMenuPlugin<MentionTypeaheadOption>
//       onQueryChange={setQueryString}
//       onSelectOption={onSelectOption}
//       triggerFn={triggerFn}
//       options={options}
//       menuRenderFn={(
//         anchorElementRef,
//         { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }
//       ) =>
//         anchorElementRef.current && options.length
//           ? ReactDOM.createPortal(
//               <div
//                 className="typeahead-popover mentions-menu"
//                 ref={(el) =>
//                   adjustMentionsMenuPosition(
//                     el,
//                     anchorElementRef.current,
//                     window
//                   )
//                 }
//               >
//                 <ul>
//                   {loading ? (
//                     <div className="mentions-menu-loading">Loading...</div>
//                   ) : results.length ? (
//                     options.map((option, i: number) => (
//                       <MentionsTypeaheadMenuItem
//                         key={option.key}
//                         index={i}
//                         isSelected={selectedIndex === i}
//                         onClick={() => {
//                           setHighlightedIndex(i);
//                           selectOptionAndCleanUp(option);
//                         }}
//                         onMouseEnter={() => {
//                           setHighlightedIndex(i);
//                         }}
//                         option={option}
//                       />
//                     ))
//                   ) : (
//                     <>No suggestions</>
//                   )}
//                 </ul>
//               </div>,
//               anchorElementRef.current
//             )
//           : null
//       }
//     />
//   );
// }
