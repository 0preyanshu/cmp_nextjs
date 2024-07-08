export function isNavItemActive({ disabled, external, href, matcher, pathname }) {
  if (disabled || !href || external) {
    return false;}
  if(pathname==="/dashboard"){
    return pathname === href;
  }


console.log("pathname", pathname)
  if (matcher) {
    

    
    if (matcher.type === 'startsWith') {
      return pathname.startsWith(matcher.href);
    }

    if (matcher.type === 'equals') {
      return pathname === matcher.href;
    }

    return false;
  }

  return pathname.startsWith(href);
}
