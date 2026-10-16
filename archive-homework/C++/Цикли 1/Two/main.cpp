#include <iostream>

using namespace std;

int main()
{
  int x = 1;
  int y = 1;
  int result = 1;

  cout << "Enter x >>> ";
  cin >> x;
  cout << "Enter y >>> ";
  cin >> y;
  
  int f = 0;
  while (f < y)
  {
    result = result * x;
    f = f + 1;
  }

  cout << x << " v stepeni " << y << " = " << result << endl;
  system("pause");
}